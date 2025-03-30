import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../declarations/password_manager_backend/password_manager_backend.did.js";
import { Principal } from "@dfinity/principal";

const canisterId = "q32rk-tqaaa-aaaao-a4cjq-cai"; 
const localCanisterId = "bkyz2-fmaaa-aaaaa-qaaaq-cai"; 

const isProduction = "ic";
const effectiveCanisterId = isProduction ? canisterId : localCanisterId;

const agent = new HttpAgent({ 
  host: isProduction ? "https://icp0.io" : "http://127.0.0.1:4943" 
});

if (!isProduction) {
  agent.fetchRootKey().catch((err) => {
    console.error("Unable to fetch root key. Ensure the local replica is running.");
    console.error(err);
  });
}

const backend = Actor.createActor(idlFactory, { 
  agent, 
  canisterId: effectiveCanisterId,
});

const storeCredentials = async (principalId, site, username, password) => {
  const principalid = Principal.fromText(principalId);
  try {
    await backend.add_entry(principalid, site, username, password);
  } catch (error) {
    console.log("Error storing credentials:", error);
  }
}

const getCredentials = async (principalId) => {
  const principalid = Principal.fromText(principalId);
  try {
    let credentials = await backend.get_entries(principalid);
    return credentials;
  } catch (error) {
    console.log("Error retrieving credentials:", error);
    return null;
  }
}

const editCredentials = async (principalId, site, username, password) => {
  const principalid = Principal.fromText(principalId);
  try {
    await backend.edit_entry(principalid, site, username, password);
  } catch (error) {
    console.log("Error editing credentials:", error);
  }
}

const deleteCredentials = async (principalId, site) => {
  const principalid = Principal.fromText(principalId);
  try {
    await backend.delete_entry(principalid, site);
  } catch (error) {
    console.log("Error deleting credentials:", error);
  }
}

export { storeCredentials, getCredentials, editCredentials, deleteCredentials };
