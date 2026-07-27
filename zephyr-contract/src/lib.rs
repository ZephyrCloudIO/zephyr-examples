mod types;

use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupSet, Vector};
use near_sdk::{env, near_bindgen, AccountId};
use types::DeploymentRecord;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
#[borsh(crate = "near_sdk::borsh")]
pub struct DeployRegistry {
    admin: AccountId,
    authorized: LookupSet<AccountId>,
    deployments: Vector<DeploymentRecord>,
}

impl Default for DeployRegistry {
    fn default() -> Self {
        env::panic_str("DeployRegistry must be initialized via new(admin)")
    }
}

#[near_bindgen]
impl DeployRegistry {
    #[init]
    pub fn new(admin: AccountId) -> Self {
        Self {
            admin: admin.clone(),
            authorized: LookupSet::new(b"a"),
            deployments: Vector::new(b"d"),
        }
    }

    pub fn add_authorized(&mut self, account: AccountId) {
        self.assert_admin();
        self.authorized.insert(&account);
        env::log_str(&format!("authorized {}", account));
    }

    pub fn remove_authorized(&mut self, account: AccountId) {
        self.assert_admin();
        self.authorized.remove(&account);
    }

    pub fn is_authorized(&self, account: AccountId) -> bool {
        self.authorized.contains(&account)
    }

    pub fn get_deployments(
        &self,
        from_index: Option<u64>,
        limit: Option<u64>,
    ) -> Vec<DeploymentRecord> {
        let from = from_index.unwrap_or(0);
        let limit = limit.unwrap_or_else(|| self.deployments.len());
        (from..from.saturating_add(limit))
            .filter_map(|i| self.deployments.get(i))
            .collect()
    }

    pub fn get_deployments_count(&self) -> u64 {
        self.deployments.len()
    }

    pub fn register_deployment(
        &mut self,
        manifest_hash: String,
        snapshot_id: String,
        url: String,
    ) {
        let caller = env::predecessor_account_id();
        assert!(
            self.authorized.contains(&caller),
            "account {} is not authorized to deploy",
            caller
        );

        self.deployments.push(&DeploymentRecord {
            deployer: caller.clone(),
            manifest_hash: manifest_hash.clone(),
            url: Some(url.clone()),
            snapshot_id: Some(snapshot_id),
            timestamp: env::block_timestamp_ms(),
        });

        env::log_str(&format!(
            "zephyr-deploy-registered: deployer={} manifest_hash={} url={}",
            caller, manifest_hash, url
        ));
    }
}

impl DeployRegistry {
    fn assert_admin(&self) {
        assert_eq!(env::predecessor_account_id(), self.admin, "admin only");
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::VMContextBuilder;

    fn alice() -> AccountId {
        "alice.testnet".parse().unwrap()
    }

    fn bob() -> AccountId {
        "bob.testnet".parse().unwrap()
    }

    fn set_predecessor(who: &AccountId) {
        let ctx = VMContextBuilder::new()
            .predecessor_account_id(who.clone())
            .build();
        near_sdk::testing_env!(ctx);
    }

    fn init(alice: &AccountId) -> DeployRegistry {
        set_predecessor(alice);
        DeployRegistry::new(alice.clone())
    }

    #[test]
    fn default_panics() {
        let _ = std::panic::catch_unwind(|| DeployRegistry::default());
    }

    #[test]
    fn new_initializes() {
        set_predecessor(&alice());
        let c = DeployRegistry::new(alice());
        assert_eq!(c.admin, alice());
        assert!(!c.is_authorized(alice()));
    }

    #[test]
    fn add_authorized_roundtrip() {
        let mut c = init(&alice());
        c.add_authorized(alice());
        assert!(c.is_authorized(alice()));
        c.remove_authorized(alice());
        assert!(!c.is_authorized(alice()));
    }

    #[test]
    #[should_panic(expected = "admin only")]
    fn non_admin_cannot_authorize() {
        let mut c = init(&alice());
        set_predecessor(&bob());
        c.add_authorized(alice());
    }

    #[test]
    fn ledger_starts_empty() {
        let c = init(&alice());
        assert_eq!(c.get_deployments_count(), 0);
        assert!(c.get_deployments(None, None).is_empty());
    }

    #[test]
    fn register_deployment_works() {
        let mut c = init(&alice());
        c.add_authorized(alice());
        c.register_deployment(
            "abc123".into(),
            "snap_1".into(),
            "https://app.zephyr-cloud.app".into(),
        );
        assert_eq!(c.get_deployments_count(), 1);
        let deps = c.get_deployments(None, None);
        assert_eq!(deps.len(), 1);
        assert_eq!(deps[0].deployer, alice());
        assert_eq!(deps[0].manifest_hash, "abc123");
        assert_eq!(deps[0].url.as_deref(), Some("https://app.zephyr-cloud.app"));
        assert_eq!(deps[0].snapshot_id.as_deref(), Some("snap_1"));
    }

    #[test]
    #[should_panic(expected = "not authorized")]
    fn unauthorized_cannot_register() {
        let mut c = init(&alice());
        c.register_deployment("abc".into(), "s".into(), "http://u".into());
    }
}

