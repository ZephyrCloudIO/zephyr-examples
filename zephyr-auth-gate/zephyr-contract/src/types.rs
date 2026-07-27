use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::AccountId;

/// A single deployment record kept on-chain as a provenance ledger.
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone, Debug)]
#[borsh(crate = "near_sdk::borsh")]
#[serde(crate = "near_sdk::serde")]
pub struct DeploymentRecord {
    /// NEAR account that authorized + paid for this deploy.
    pub deployer: AccountId,
    /// sha256(git HEAD + package name + version) — produced by the build.
    pub manifest_hash: String,
    /// True once the OutLayer gate released a token.
    pub authorized: bool,
    /// Final Zephyr deployment URL (filled by `register_deployment`).
    pub url: Option<String>,
    /// Zephyr snapshot id (filled by `register_deployment`).
    pub snapshot_id: Option<String>,
    /// `env::block_timestamp_ms()` at authorization time.
    pub timestamp: u64,
}