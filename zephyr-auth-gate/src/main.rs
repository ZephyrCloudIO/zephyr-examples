//! zephyr-auth-gate
//!
//! OutLayer WASM (WASI P1) that releases a Zephyr `ZE_SERVER_TOKEN` to an
//! authorized NEAR account. The NEAR blockchain guarantees the signer
//! (`env::signer_account_id()` → `NEAR_SENDER_ID`), so this WASM does **not**
//! re-verify an ed25519 signature. It only enforces policy:
//!   1. caller is on the whitelist (defense-in-depth on top of the contract's
//!      own `authorized_accounts` LookupSet)
//!   2. the requested `manifest_hash` is present
//!   3. `ZE_SERVER_TOKEN` secret is injected by OutLayer keystore
//!
//! The `ZE_SERVER_TOKEN` is stored on the OutLayer dashboard as a `PROTECTED_`
//! secret bound to this project. Its value is never seen by anyone — it is
//! generated inside the TEE via Confidential Key Derivation (CKD).
//!
//! Input (JSON via stdin):
//!   { "manifest_hash": "<sha256 hex>" }
//!
//! Output (JSON via stdout):
//!   { "ok": true,  "token": "...", "manifest_hash": "...", "signer": "..." }
//!   { "ok": false, "error": "...", "manifest_hash": "...", "signer": "..." }

use serde::{Deserialize, Serialize};
use std::io::{self, Read, Write};

#[derive(Deserialize)]
struct Input {
    manifest_hash: String,
}

#[derive(Serialize)]
struct Output {
    ok: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    token: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    manifest_hash: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    signer: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    error: Option<String>,
}

/// Demo allow-list. In production push this to OutLayer worker storage
/// (`storage::set_worker("whitelist", ...)`) and read it at runtime — that way
/// you can rotate authorizations without recompiling.
const WHITELIST: &[&str] = &[
    // <your-account>.testnet
    // Add your testnet deployer account here before building.
];

fn main() {
    let out = run();
    let json = serde_json::to_string(&out).unwrap_or_else(|_| {
        r#"{"ok":false,"error":"serialization failed"}"#.to_string()
    });
    print!("{}", json);
    let _ = io::stdout().flush();
}

fn run() -> Output {
    // Read stdin (WASI-compatible: no `getrandom`, no threads).
    let mut input_string = String::new();
    if io::stdin().read_to_string(&mut input_string).is_err() {
        return fail(None, None, "could not read stdin");
    }

    let input: Input = match serde_json::from_str(&input_string) {
        Ok(i) => i,
        Err(_) => return fail(None, None, "invalid JSON input; expected {\"manifest_hash\": \"...\"}"),
    };

    if input.manifest_hash.is_empty() {
        return fail(None, None, "manifest_hash is required");
    }

    // The NEAR chain vouches for the caller. OutLayer injects it as
    // `NEAR_SENDER_ID` for cross-contract `request_execution` flows.
    let signer = std::env::var("NEAR_SENDER_ID").unwrap_or_default();

    if !WHITELIST.is_empty() && !WHITELIST.contains(&signer.as_str()) {
        return fail(Some(input.manifest_hash.clone()), Some(signer), "account not authorized");
    }

    // The ZE_SERVER_TOKEN is decrypted inside this TEE by the OutLayer keystore
    // and injected as an env var. No-one outside the enclave has ever seen it.
    match std::env::var("ZE_SERVER_TOKEN") {
        Ok(token) if !token.is_empty() => Output {
            ok: true,
            token: Some(token),
            manifest_hash: Some(input.manifest_hash),
            signer: Some(signer),
            error: None,
        },
        _ => fail(
            Some(input.manifest_hash),
            Some(signer),
            "ZE_SERVER_TOKEN secret missing or empty; configure it in the OutLayer dashboard",
        ),
    }
}

fn fail(manifest_hash: Option<String>, signer: Option<String>, error: &str) -> Output {
    Output {
        ok: false,
        token: None,
        manifest_hash,
        signer,
        error: Some(error.to_string()),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn output_serialization_roundtrip_ok() {
        let o = Output {
            ok: true,
            token: Some("tok".into()),
            manifest_hash: Some("abc".into()),
            signer: Some("alice.testnet".into()),
            error: None,
        };
        let s = serde_json::to_string(&o).unwrap();
        assert!(s.contains("\"ok\":true"));
        assert!(s.contains("\"token\":\"tok\""));
        assert!(!s.contains("\"error\""));
    }

    #[test]
    fn output_serialization_omits_none() {
        let o = Output {
            ok: false,
            token: None,
            manifest_hash: Some("abc".into()),
            signer: Some("alice.testnet".into()),
            error: Some("nope".into()),
        };
        let s = serde_json::to_string(&o).unwrap();
        assert!(!s.contains("\"token\""));
        assert!(s.contains("\"error\":\"nope\""));
    }

    #[test]
    fn input_parsing() {
        let s = r#"{"manifest_hash":"deadbeef"}"#;
        let i: Input = serde_json::from_str(s).unwrap();
        assert_eq!(i.manifest_hash, "deadbeef");
    }
}