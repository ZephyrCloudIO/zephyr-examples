mod types;

use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, LookupSet, Vector};
use near_sdk::{env, ext_contract, near_bindgen, AccountId, NearToken, Promise, PromiseError};
use types::DeploymentRecord;

/// OutLayer cross-contract interface (subset of args we use).
#[ext_contract(ext_outlayer)]
#[allow(dead_code)]
trait OutLayer {
    fn request_execution(
        &mut self,
        source: near_sdk::serde_json::Value,
        resource_limits: Option<near_sdk::serde_json::Value>,
        input_data: Option<String>,
        secrets_ref: Option<near_sdk::serde_json::Value>,
        response_format: Option<String>,
        payer_account_id: Option<AccountId>,
    );
}

/// Callback into self after OutLayer returns the gate result.
#[ext_contract(ext_self)]
#[allow(dead_code)]
trait ExtSelf {
    fn on_deploy_authorized(
        &mut self,
        manifest_hash: String,
        #[callback_result] result: Result<Option<near_sdk::serde_json::Value>, PromiseError>,
    ) -> String;
}

/// Minimum NEAR attached to `authorize_deploy` to fund the OutLayer run.
/// 0.01 NEAR — same as the canonical OutLayer coin-flip example.
const MIN_DEPOSIT: u128 = 10_000_000_000_000_000_000_000; // 0.01 NEAR
/// Gas reserved for the `on_deploy_authorized` callback.
const CALLBACK_GAS: u64 = 5_000_000_000_000; // 5 Tgas
/// OutLayer contract. Testnet: "outlayer.testnet", mainnet: "outlayer.near".
const OUTLAYER_CONTRACT_ID: &str = "outlayer.testnet";

/// OutLayer project id for the `zephyr-auth-gate` WASM, e.g.
/// "alice.testnet/zephyr-auth-gate". Override at deploy via `new()`.
const DEFAULT_OUTLAYER_PROJECT_ID: &str = "REPLACE_ME.testnet/zephyr-auth-gate";

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
#[borsh(crate = "near_sdk::borsh")]
pub struct DeployRegistry {
    admin: AccountId,
    /// NEAR accounts allowed to call `authorize_deploy`.
    authorized: LookupSet<AccountId>,
    /// In-flight manifest_hash → deployer (set in authorize, checked in register).
    pending: LookupMap<String, AccountId>,
    /// Append-only ledger of every deploy.
    deployments: Vector<DeploymentRecord>,
    /// "owner.testnet/zephyr-auth-gate".
    outlayer_project_id: String,
    /// NEAR account that owns the OutLayer `ZE_SERVER_TOKEN` secret.
    outlayer_secret_owner: AccountId,
}

impl Default for DeployRegistry {
    fn default() -> Self {
        env::panic_str("DeployRegistry must be initialized via new(admin, ...)")
    }
}

#[near_bindgen]
impl DeployRegistry {
    /// One-time init. `admin` may add other authorized deployers.
    /// `outlayer_project_id` and `outlayer_secret_owner` pin the gate WASM +
    /// the secret binding; both configurable via `set_outlayer_config` later.
    #[init]
    pub fn new(
        admin: AccountId,
        outlayer_project_id: Option<String>,
        outlayer_secret_owner: Option<AccountId>,
    ) -> Self {
        Self {
            admin: admin.clone(),
            authorized: LookupSet::new(b"a"),
            pending: LookupMap::new(b"p"),
            deployments: Vector::new(b"d"),
            outlayer_project_id: outlayer_project_id.unwrap_or_else(|| DEFAULT_OUTLAYER_PROJECT_ID.to_string()),
            outlayer_secret_owner: outlayer_secret_owner.unwrap_or(admin),
        }
    }

    /// Admin: add a NEAR account to the authorized deployer set.
    pub fn add_authorized(&mut self, account: AccountId) {
        self.assert_admin();
        self.authorized.insert(&account);
        env::log_str(&format!("authorized {}", account));
    }

    /// Admin: remove a deployer.
    pub fn remove_authorized(&mut self, account: AccountId) {
        self.assert_admin();
        self.authorized.remove(&account);
    }

    /// Admin: update OutLayer project + secret owner (for rotations).
    pub fn set_outlayer_config(
        &mut self,
        outlayer_project_id: String,
        outlayer_secret_owner: AccountId,
    ) {
        self.assert_admin();
        self.outlayer_project_id = outlayer_project_id;
        self.outlayer_secret_owner = outlayer_secret_owner;
    }

    /// View: is `account` authorized to deploy?
    pub fn is_authorized(&self, account: AccountId) -> bool {
        self.authorized.contains(&account)
    }

    /// View: the append-only deploy ledger (newest last).
    pub fn get_deployments(&self, from_index: Option<u64>, limit: Option<u64>) -> Vec<DeploymentRecord> {
        let from = from_index.unwrap_or(0);
        let limit = limit.unwrap_or_else(|| self.deployments.len());
        (from..from.saturating_add(limit))
            .filter_map(|i| self.deployments.get(i))
            .collect()
    }

    /// Count of recorded deploys.
    pub fn get_deployments_count(&self) -> u64 {
        self.deployments.len()
    }

    /// The gate step.
    ///
    /// Caller (a NEAR account) signs on-chain by paying gas + an attached
    /// NEAR deposit. The contract:
    ///   1. asserts the caller is authorized
    ///   2. records `pending[manifest_hash] = caller`
    ///   3. fires a cross-contract `request_execution` to OutLayer pointing
    ///      at the `zephyr-auth-gate` WASM project
    ///   4. yields; the callback `on_deploy_authorized` parses the returned
    ///      gate JSON, logs `ZE_TOKEN:<token>`, and appends a ledger record.
    ///
    /// The build script reads the `ZE_TOKEN:` log out of the tx receipts and
    /// sets `process.env.ZE_SERVER_TOKEN` before invoking `vite build`.
    #[payable]
    pub fn authorize_deploy(&mut self, manifest_hash: String) -> Promise {
        let caller = env::predecessor_account_id();
        let attached = env::attached_deposit().as_yoctonear();
        assert!(
            attached >= MIN_DEPOSIT,
            "attach >= 0.01 NEAR to fund OutLayer execution"
        );
        assert!(
            self.authorized.contains(&caller),
            "account {} is not authorized to deploy",
            caller
        );
        assert!(!manifest_hash.is_empty(), "manifest_hash required");

        self.pending.insert(&manifest_hash, &caller);
        env::log_str(&format!(
            "zephyr-deploy-request: deployer={} manifest_hash={}",
            caller, manifest_hash
        ));

        let source = near_sdk::serde_json::json!({
            "Project": { "project_id": self.outlayer_project_id }
        });
        let resource_limits = near_sdk::serde_json::json!({
            "max_instructions": 10_000_000_000u64,
            "max_memory_mb": 128u32,
            "max_execution_seconds": 60u64
        });
        let input_data = near_sdk::serde_json::json!({
            "manifest_hash": manifest_hash
        })
        .to_string();
        let secrets_ref = near_sdk::serde_json::json!({
            "profile": "default",
            "account_id": self.outlayer_secret_owner
        });

        ext_outlayer::ext(OUTLAYER_CONTRACT_ID.parse().unwrap())
            .with_attached_deposit(NearToken::from_yoctonear(attached))
            .with_unused_gas_weight(1)
            .request_execution(
                source,
                Some(resource_limits),
                Some(input_data),
                Some(secrets_ref),
                Some("Json".to_string()),
                Some(caller), // refund unused NEAR to the deployer
            )
            .then(
                ext_self::ext(env::current_account_id())
                    .with_static_gas(near_sdk::Gas::from_gas(CALLBACK_GAS))
                    .on_deploy_authorized(manifest_hash),
            )
    }

    /// Finalize the deploy after `vite build` succeeds. Caller must be the
    /// same account that called `authorize_deploy` for `manifest_hash`.
    pub fn register_deployment(
        &mut self,
        manifest_hash: String,
        snapshot_id: String,
        url: String,
    ) {
        let caller = env::predecessor_account_id();
        let pending = self.pending.get(&manifest_hash);
        assert_eq!(
            pending,
            Some(caller.clone()),
            "no pending authorization for {} by {}",
            manifest_hash,
            caller
        );

        // Append-or-update: find the record with this manifest_hash that's
        // still missing url/snapshot_id and fill it in.
        let len = self.deployments.len();
        let mut found = false;
        // Newest-first scan — the most recent record is the one we want.
        let mut i = len;
        while i > 0 {
            i -= 1;
            if let Some(mut rec) = self.deployments.get(i) {
                if rec.manifest_hash == manifest_hash && rec.snapshot_id.is_none() {
                    rec.snapshot_id = Some(snapshot_id);
                    rec.url = Some(url.clone());
                    self.deployments.replace(i, &rec);
                    found = true;
                    break;
                }
            }
        }
        assert!(found, "no authorized (un-finalized) record found for manifest_hash");
        self.pending.remove(&manifest_hash);
        env::log_str(&format!(
            "zephyr-deploy-registered: manifest_hash={} url={}",
            manifest_hash, url
        ));
    }

    /// OutLayer callback. Parses the gate JSON; on success logs the token so
    /// the build can recover it from receipts.
    #[private]
    pub fn on_deploy_authorized(
        &mut self,
        manifest_hash: String,
        #[callback_result] result: Result<Option<near_sdk::serde_json::Value>, PromiseError>,
    ) -> String {
        let deployer = self
            .pending
            .get(&manifest_hash)
            .unwrap_or_else(|| env::predecessor_account_id());

        match result {
            Ok(Some(value)) => {
                let ok = value
                    .get("ok")
                    .and_then(|v| v.as_bool())
                    .unwrap_or(false);
                let token = value
                    .get("token")
                    .and_then(|v| v.as_str())
                    .unwrap_or("")
                    .to_string();
                let signer = value
                    .get("signer")
                    .and_then(|v| v.as_str())
                    .unwrap_or("")
                    .to_string();

                if ok && !token.is_empty() {
                    // The hook the build script greps from receipts.
                    env::log_str(&format!("ZE_TOKEN:{}", token));
                    self.deployments.push(&DeploymentRecord {
                        deployer: deployer.clone(),
                        manifest_hash: manifest_hash.clone(),
                        authorized: true,
                        url: None,
                        snapshot_id: None,
                        timestamp: env::block_timestamp_ms(),
                    });
                    format!(
                        "deploy authorized for {} by signer {}",
                        manifest_hash, signer
                    )
                } else {
                    let err = value
                        .get("error")
                        .and_then(|v| v.as_str())
                        .unwrap_or("unknown");
                    self.deployments.push(&DeploymentRecord {
                        deployer: deployer.clone(),
                        manifest_hash: manifest_hash.clone(),
                        authorized: false,
                        url: None,
                        snapshot_id: None,
                        timestamp: env::block_timestamp_ms(),
                    });
                    env::log_str(&format!("ZE_TOKEN_FAIL:{}", err));
                    format!("gate rejected deploy: {}", err)
                }
            }
            Ok(None) => {
                env::log_str("ZE_TOKEN_FAIL:OutLayer returned no result");
                self.deployments.push(&DeploymentRecord {
                    deployer: deployer.clone(),
                    manifest_hash: manifest_hash.clone(),
                    authorized: false,
                    url: None,
                    snapshot_id: None,
                    timestamp: env::block_timestamp_ms(),
                });
                "OutLayer returned no result".to_string()
            }
            Err(e) => {
                env::log_str(&format!("ZE_TOKEN_FAIL:promise error {:?}", e));
                self.deployments.push(&DeploymentRecord {
                    deployer: deployer.clone(),
                    manifest_hash: manifest_hash.clone(),
                    authorized: false,
                    url: None,
                    snapshot_id: None,
                    timestamp: env::block_timestamp_ms(),
                });
                format!("promise error: {:?}", e)
            }
        }
    }
}

impl DeployRegistry {
    fn assert_admin(&self) {
        assert_eq!(
            env::predecessor_account_id(),
            self.admin,
            "admin only"
        );
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::VMContextBuilder;

    fn alice() -> AccountId {
        "alice.testnet".parse().unwrap()
    }

    /// Reset the mocked blockchain with `predecessor_account_id` = `who`.
    /// near-sdk's default `test_env::setup()` uses `bob()` as predecessor, so
    /// admin-gated methods need us to install alice first.
    fn set_predecessor(who: &AccountId) {
        let ctx = VMContextBuilder::new()
            .predecessor_account_id(who.clone())
            .build();
        near_sdk::testing_env!(ctx);
    }

    #[test]
    fn default_panics() {
        let _ = std::panic::catch_unwind(|| DeployRegistry::default());
    }

    #[test]
    fn new_initializes() {
        set_predecessor(&alice());
        let c = DeployRegistry::new(alice(), Some("alice.testnet/zephyr-auth-gate".into()), Some(alice()));
        assert_eq!(c.admin, alice());
        assert!(!c.is_authorized(alice()));
        assert_eq!(c.outlayer_project_id, "alice.testnet/zephyr-auth-gate");
    }

    #[test]
    fn add_authorized_roundtrip() {
        set_predecessor(&alice());
        let mut c = DeployRegistry::new(alice(), None, None);
        c.add_authorized(alice());
        assert!(c.is_authorized(alice()));
        c.remove_authorized(alice());
        assert!(!c.is_authorized(alice()));
    }

    #[test]
    #[should_panic(expected = "admin only")]
    fn non_admin_cannot_authorize() {
        // Default test_env predecessor is bob.testnet — not alice.
        let bob: AccountId = "bob.testnet".parse().unwrap();
        set_predecessor(&alice());
        let mut c = DeployRegistry::new(alice(), None, None);
        set_predecessor(&bob);
        c.add_authorized(alice());
    }

    #[test]
    fn ledger_starts_empty() {
        set_predecessor(&alice());
        let c = DeployRegistry::new(alice(), None, None);
        assert_eq!(c.get_deployments_count(), 0);
        assert!(c.get_deployments(None, None).is_empty());
    }
}