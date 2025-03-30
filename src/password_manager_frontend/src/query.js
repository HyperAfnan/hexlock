import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../declarations/password_manager_backend/password_manager_backend.did.js";
import { Principal } from "@dfinity/principal";

const principalId = Principal.fromText("rbkko-uqsqx-wrbi3-zzsdi-6iemk-abmnb-vn7v7-ka5ge-io67q-kp7cx-gqe");

const canisterId = "bkyz2-fmaaa-aaaaa-qaaaq-cai";

const agent = new HttpAgent({ host: "http://127.0.0.1:4943" });

if (process.env.DFX_NETWORK !== "ic") {
  agent.fetchRootKey().catch((err) => {
    console.error("Unable to fetch root key. Ensure the local replica is running.");
    console.error(err);
  });
}

const backend = Actor.createActor(idlFactory, { agent, canisterId, });

/* const testBackend = async () => {
   try {
     const site = "https://example.com";
     const username = "test_username";
     const password = "test_password";

     // Call add_entry
     console.log("Adding credentials...");
     await backend.add_entry(principalId, site, username, password);
     console.log("Credentials added successfully!");

     // Call get_entry
     console.log("Getting credentials...");
     const credentials = await backend.get_entries(principalId);
     console.log("Retrieved credentials:", credentials);
   } catch (error) {
     console.error("Error testing backend canister:", error);
   }
 };
 testBackend(); */

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


const deleteCredentials = async (principalId, site, username, password) => {
   const principalid = Principal.fromText(principalId);
   try {
      await backend.delete_entry(principalid, site, username, password);
   } catch (error) {
      console.log("Error editing credentials:", error);
   }
}
export { storeCredentials, getCredentials, editCredentials, deleteCredentials };
