use candid::{CandidType, Deserialize, Principal};
use ic_cdk_macros::{query, update};
use std::sync::Mutex;

#[derive(Clone, Debug, CandidType, Deserialize)]
struct PasswordEntry {
    site: String,
    username: String,
    password: String,
    encrypted: bool,
    principal_id: Principal,
}

#[derive(Default)]
struct PasswordManager {
    entries: Vec<PasswordEntry>,
}

lazy_static::lazy_static! {
    static ref PASSWORD_MANAGER: Mutex<PasswordManager> = Mutex::new(PasswordManager::default());
}

#[macro_export]
macro_rules! set_credentials {
    ($manager:ident, $principal_id:expr, $site:expr, $username:expr, $password:expr) => {
        {
            let entry = PasswordEntry {
                site: $site.to_string(),
                username: $username.to_string(),
                password: $password.to_string(),
                encrypted: false,
                principal_id: $principal_id,
            };
            $manager.entries.push(entry);
        }
    };
}

#[macro_export]
macro_rules! get_credentials {
    ($manager:ident, $principal_id:expr) => {
        $manager.entries.iter()
            .filter(|entry| entry.principal_id == $principal_id)
            .cloned()
            .collect::<Vec<_>>()
    };
}

#[update]
fn add_entry(principal_id: Principal, site: String, username: String, password: String) {
    let mut manager = PASSWORD_MANAGER.lock().unwrap();
    set_credentials!(manager, principal_id, site, username, password);
}

#[query]
fn get_entries(principal_id: Principal) -> Vec<PasswordEntry> {
    let manager = PASSWORD_MANAGER.lock().unwrap();
    get_credentials!(manager, principal_id)
}

#[query]
fn get_entry(principal_id: Principal, site: String) -> Option<PasswordEntry> {
    let manager = PASSWORD_MANAGER.lock().unwrap();
    manager.entries.iter()
        .find(|&entry| entry.principal_id == principal_id && entry.site == site)
        .cloned()
}

#[update]
fn edit_entry(principal_id: Principal, site: String, new_username: String, new_password: String) -> bool {
    let mut manager = PASSWORD_MANAGER.lock().unwrap();
    if let Some(entry) = manager.entries.iter_mut()
        .find(|entry| entry.principal_id == principal_id && entry.site == site) {
        entry.username = new_username;
        entry.password = new_password;
        true
    } else {
        false
    }
}

#[update]
fn delete_entry(principal_id: Principal, site: String) -> bool {
    let mut manager = PASSWORD_MANAGER.lock().unwrap();
    let initial_length = manager.entries.len();
    
    // Remove entries matching both principal_id and site
    manager.entries.retain(|entry| !(entry.principal_id == principal_id && entry.site == site));
    
    // Return true if an entry was removed, false otherwise
    manager.entries.len() < initial_length
}
