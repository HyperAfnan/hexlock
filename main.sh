#!/bin/bash

# Build the canister
cargo build --target wasm32-unknown-unknown --release

# Create target/candid directory if it doesn't exist
mkdir -p target/candid

# Extract the Candid interface (using the correct syntax)
ic-wasm target/wasm32-unknown-unknown/release/password_manager_backend.wasm metadata get candid > target/candid/password_manager_backend.did

# Copy the generated Candid file to the project
if [ -f "target/candid/password_manager_backend.did" ]; then
    cp target/candid/password_manager_backend.did src/password_manager_backend/
    echo "Candid file generated at src/password_manager_backend/password_manager_backend.did"
else
    echo "Error: Candid file was not generated."
    exit 1
fi
