#!/bin/bash
set -e

echo "🔨 Building random-contract..."

# Build the contract with cargo near (includes wasm-opt)
cargo near build non-reproducible-wasm

echo "✅ Build complete!"
echo "📦 WASM: target/near/random_contract.wasm"
echo "📄 ABI:  target/near/random_contract_abi.json"
