use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::AccountId;

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone, Debug)]
#[borsh(crate = "near_sdk::borsh")]
#[serde(crate = "near_sdk::serde")]
pub struct DeploymentRecord {
    pub deployer: AccountId,
    pub manifest_hash: String,
    pub url: Option<String>,
    pub snapshot_id: Option<String>,
    pub timestamp: u64,
}
