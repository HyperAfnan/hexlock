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
    ($manager:ident, $principal_id:expr, $site:expr) => {
        {
            $manager.entries.iter()
                .find(|&entry| entry.site == $site && entry.principal_id == $principal_id)
                .cloned()
        }
    };
}

#[update]
fn add_entry(principal_id: Principal, site: String, username: String, password: String) {
    let mut manager = PASSWORD_MANAGER.lock().unwrap();
    set_credentials!(manager, principal_id, site, username, password);
}

#[query]
fn get_entry(principal_id: Principal, site: String) -> Option<PasswordEntry> {
    let manager = PASSWORD_MANAGER.lock().unwrap();
    get_credentials!(manager, principal_id, site)
}
