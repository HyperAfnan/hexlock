use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::call::call;
use ic_cdk::api::caller as get_caller;
use ic_cdk_macros::{init, post_upgrade, pre_upgrade, query, update};
use std::cell::RefCell;
use std::collections::{BTreeMap, HashMap};

thread_local! {
    static PASS_ID: RefCell<u64> = RefCell::new(1);
    static PASSWORD_MAP: RefCell<BTreeMap<u64, Password>> = RefCell::new(BTreeMap::new());
    static OWNER_PASS_IDS: RefCell<HashMap<Principal, Vec<u64>>> = RefCell::new(HashMap::new());
    static INITIALIZER: RefCell<Principal> = RefCell::new(Principal::anonymous());
}

// Types
type PassId = u64;

#[derive(CandidType, Deserialize, Clone)]
struct Password {
    encrypted_name: String,
    encrypted_username: String,
    encrypted_pass: String,
    encrypted_url: String,
}

#[derive(CandidType, Deserialize, Clone)]
struct QueryPassword {
    id: u64,
    encrypted_name: String,
    encrypted_username: String,
    encrypted_pass: String,
    encrypted_url: String,
}

// VETKey related types
#[derive(CandidType, Deserialize)]
struct PublicKeyReply {
    public_key: Vec<u8>,
}

#[derive(CandidType, Deserialize)]
struct EncryptedKeyReply {
    encrypted_key: Vec<u8>,
}

// VETKey argument structures
#[derive(CandidType, Deserialize)]
struct KeyId {
    curve: Curve,
    name: String,
}

#[derive(CandidType, Deserialize)]
enum Curve {
    #[serde(rename = "bls12_381")]
    BLS12_381,
}

#[derive(CandidType, Deserialize)]
struct PublicKeyArgs {
    canister_id: Option<Principal>,
    derivation_path: Vec<Vec<u8>>,
    key_id: KeyId,
}

#[derive(CandidType, Deserialize)]
struct EncryptedKeyArgs {
    derivation_id: Vec<u8>,
    public_key_derivation_path: Vec<Vec<u8>>,
    key_id: KeyId,
    encryption_public_key: Vec<u8>,
}

// For stable storage
#[derive(CandidType, Deserialize)]
struct State {
    pass_id: u64,
    password_map: BTreeMap<u64, Password>,
    owner_pass_ids: HashMap<Principal, Vec<u64>>,
    initializer: Principal,
}

// Initialize the canister
#[init]
fn init() {
    INITIALIZER.with(|initializer| {
        *initializer.borrow_mut() = get_caller();
    });
}

// Password Functions
#[update]
async fn add_password(password: Password) -> std::result::Result<PassId, String> {
    let caller = get_caller();
    if caller == Principal::anonymous() {
        return Err("Anonymous caller not allowed".to_string());
    }

    let id = PASS_ID.with(|pass_id| {
        let current_id = *pass_id.borrow();
        *pass_id.borrow_mut() = current_id + 1;
        current_id
    });

    OWNER_PASS_IDS.with(|owner_pass_ids| {
        let mut owner_map = owner_pass_ids.borrow_mut();
        let ids = owner_map.entry(caller).or_insert_with(Vec::new);
        ids.push(id);
    });

    PASSWORD_MAP.with(|password_map| {
        password_map.borrow_mut().insert(id, password);
    });

    Ok(id)
}

#[update]
async fn get_passwords() -> std::result::Result<Vec<QueryPassword>, String> {
    let caller = get_caller();
    if caller == Principal::anonymous() {
        return Err("Anonymous caller not allowed".to_string());
    }

    OWNER_PASS_IDS.with(|owner_pass_ids| {
        let owner_map = owner_pass_ids.borrow();
        match owner_map.get(&caller) {
            Some(pass_ids) => {
                let result = PASSWORD_MAP.with(|password_map| {
                    let map = password_map.borrow();
                    pass_ids
                        .iter()
                        .filter_map(|id| {
                            map.get(id).map(|password| QueryPassword {
                                id: *id,
                                encrypted_name: password.encrypted_name.clone(),
                                encrypted_username: password.encrypted_username.clone(),
                                encrypted_pass: password.encrypted_pass.clone(),
                                encrypted_url: password.encrypted_url.clone(),
                            })
                        })
                        .collect::<Vec<QueryPassword>>()
                });
                Ok(result)
            }
            None => Err("You have no Passwords".to_string()),
        }
    })
}

#[update]
async fn delete_password(id: PassId) -> std::result::Result<(), String> {
    let caller = get_caller();
    if caller == Principal::anonymous() {
        return Err("Anonymous caller not allowed".to_string());
    }

    let result: std::result::Result<(), String> = OWNER_PASS_IDS.with(|owner_pass_ids| {
        let mut owner_map = owner_pass_ids.borrow_mut();
        let pass_ids = match owner_map.get_mut(&caller) {
            Some(ids) => ids,
            None => return Err("Error: You have no Passwords".to_string()),
        };
        
        let id_pos = match pass_ids.iter().position(|&x| x == id) {
            Some(pos) => pos,
            None => return Err("Error: Could not find Password".to_string()),
        };
        
        pass_ids.remove(id_pos);
        
        if pass_ids.is_empty() {
            owner_map.remove(&caller);
        }
        
        Ok(())
    });
    
    if let Err(e) = result {
        return Err(e);
    }

    PASSWORD_MAP.with(|password_map| {
        let mut map = password_map.borrow_mut();
        if map.remove(&id).is_some() {
            Ok(())
        } else {
            Err("Error: Could not find Password in Map".to_string())
        }
    })
}

#[update]
async fn update_password(password: QueryPassword) -> std::result::Result<Vec<QueryPassword>, String> {
    let caller = get_caller();
    if caller == Principal::anonymous() {
        return Err("Anonymous caller not allowed".to_string());
    }

    // Check if user has any passwords
    OWNER_PASS_IDS.with(|owner_pass_ids| {
        let owner_map = owner_pass_ids.borrow();
        let pass_ids = match owner_map.get(&caller) {
            Some(ids) => ids,
            None => return Err("Error: You have no Passwords".to_string()),
        };
        
        if !pass_ids.contains(&password.id) {
            return Err("Error: Could not find Password".to_string());
        }
        
        // Update the password
        PASSWORD_MAP.with(|password_map| {
            let mut map = password_map.borrow_mut();
            if !map.contains_key(&password.id) {
                return Err("Error: Could not find Password in Map".to_string());
            }
            
            map.insert(
                password.id,
                Password {
                    encrypted_name: password.encrypted_name.clone(),
                    encrypted_username: password.encrypted_username.clone(),
                    encrypted_pass: password.encrypted_pass.clone(),
                    encrypted_url: password.encrypted_url.clone(),
                },
            );
            
            // Return all passwords including the updated one
            let result = pass_ids
                .iter()
                .filter_map(|id| {
                    map.get(id).map(|p| QueryPassword {
                        id: *id,
                        encrypted_name: p.encrypted_name.clone(),
                        encrypted_username: p.encrypted_username.clone(),
                        encrypted_pass: p.encrypted_pass.clone(),
                        encrypted_url: p.encrypted_url.clone(),
                    })
                })
                .collect();
            
            Ok(result)
        })
    })
}

#[query]
fn cycle_balance() -> u64 {
    ic_cdk::api::canister_balance()
}

#[query]
fn get_initializer() -> String {
    INITIALIZER.with(|initializer| {
        initializer.borrow().to_string()
    })
}

// VETKeys Implementation
#[update]
async fn symmetric_key_verification_key() -> std::result::Result<String, String> {
    let mut derivation_path = Vec::new();
    derivation_path.push("symmetric_key".as_bytes().to_vec());
    
    let args = PublicKeyArgs {
        canister_id: None,
        derivation_path,
        key_id: KeyId {
            curve: Curve::BLS12_381,
            name: "test_key_1".to_string(),
        },
    };
    
    // The canister ID should be the actual ID of the VET KD system API canister
    let vetkd_system_api_canister_id = Principal::from_text("aaaaa-aa").unwrap();
    
    match call::<(PublicKeyArgs,), (PublicKeyReply,)>(
        vetkd_system_api_canister_id,
        "vetkd_public_key", 
        (args,)
    ).await {
        Ok((res,)) => Ok(hex::encode(&res.public_key)),
        Err((code, msg)) => Err(format!("Error calling vetkd_system_api: {}: {}", code as u8, msg))
    }
}

#[update]
async fn encrypted_symmetric_key_for_caller(encryption_public_key: Vec<u8>) -> std::result::Result<String, String> {
    let caller = get_caller();
    let derivation_id = caller.as_slice().to_vec();
    
    let mut public_key_derivation_path = Vec::new();
    public_key_derivation_path.push("symmetric_key".as_bytes().to_vec());
    
    let args = EncryptedKeyArgs {
        derivation_id,
        public_key_derivation_path,
        key_id: KeyId {
            curve: Curve::BLS12_381,
            name: "test_key_1".to_string(),
        },
        encryption_public_key,
    };
    
    // The canister ID should be the actual ID of the VET KD system API canister
    let vetkd_system_api_canister_id = Principal::from_text("aaaaa-aa").unwrap();
    
    match call::<(EncryptedKeyArgs,), (EncryptedKeyReply,)>(
        vetkd_system_api_canister_id,
        "vetkd_encrypted_key", 
        (args,)
    ).await {
        Ok((res,)) => Ok(hex::encode(&res.encrypted_key)),
        Err((code, msg)) => Err(format!("Error calling vetkd_system_api: {}: {}", code as u8, msg))
    }
}

// Pre-upgrade stores the state
#[pre_upgrade]
fn pre_upgrade() {
    // Save state to stable storage in a more structured way
    let state = State {
        pass_id: PASS_ID.with(|cell| *cell.borrow()),
        password_map: PASSWORD_MAP.with(|map| map.borrow().clone()),
        owner_pass_ids: OWNER_PASS_IDS.with(|map| map.borrow().clone()),
        initializer: INITIALIZER.with(|cell| *cell.borrow()),
    };

    match ic_cdk::storage::stable_save((0, state)) {
        Ok(_) => (),
        Err(e) => ic_cdk::trap(&format!("Failed to save state: {}", e)),
    }
}

// Post-upgrade restores the state
#[post_upgrade]
fn post_upgrade() {
    // If this is a first deployment, initialize with default values
    let fallback_state = State {
        pass_id: 1,
        password_map: BTreeMap::new(),
        owner_pass_ids: HashMap::new(),
        initializer: get_caller(),
    };
    
    // Try to restore state from stable storage - handle errors gracefully
    match ic_cdk::storage::stable_restore::<(u8, State)>() {
        Ok((_, state)) => {
            PASS_ID.with(|cell| *cell.borrow_mut() = state.pass_id);
            PASSWORD_MAP.with(|map| *map.borrow_mut() = state.password_map);
            OWNER_PASS_IDS.with(|map| *map.borrow_mut() = state.owner_pass_ids);
            INITIALIZER.with(|cell| *cell.borrow_mut() = state.initializer);
        }
        Err(_) => {
            // If restore fails, use the fallback state
            ic_cdk::println!("No previous state found or state restoration failed. Initializing with default values.");
            PASS_ID.with(|cell| *cell.borrow_mut() = fallback_state.pass_id);
            PASSWORD_MAP.with(|map| *map.borrow_mut() = fallback_state.password_map);
            OWNER_PASS_IDS.with(|map| *map.borrow_mut() = fallback_state.owner_pass_ids);
            INITIALIZER.with(|cell| *cell.borrow_mut() = fallback_state.initializer);
        }
    }
}

// Generate the Candid interface
ic_cdk::export_candid!();
