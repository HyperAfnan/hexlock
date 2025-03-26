import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Nat8 "mo:base/Nat8";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

// Define the actor class
actor HexLock {

  // Password record type
  type Password = {
    id : Nat;
    encrypted_name : Text;
    encrypted_username : Text;
    encrypted_password : Text;
    encrypted_url : Text;
    encrypted_notes : Text;
    category_name : Text;
    created_at : Time.Time;
    updated_at : Time.Time;
  };

  // Password view (for query results)
  public type PasswordView = {
    id : Nat;
    encrypted_name : Text;
    encrypted_username : Text;
    encrypted_password : Text;
    encrypted_url : Text;
    encrypted_notes : Text;
    category_name : Text;
    created_at : Time.Time;
    updated_at : Time.Time;
  };

  // Category record type
  type Category = {
    name : Text;
    created_at : Time.Time;
  };

  // Threshold ECDSA interface to the Internet Computer management canister
  type IC = actor {
    ecdsa_public_key : ({
      canister_id : ?Principal;
      derivation_path : [Blob];
      key_id : { curve: { #secp256k1 } ; name: Text };
    }) -> async ({ public_key : Blob; chain_code : Blob; });
    
    sign_with_ecdsa : ({
      message_hash : Blob;
      derivation_path : [Blob];
      key_id : { curve: { #secp256k1 } ; name: Text };
    }) -> async ({ signature : Blob });
  };

  // Initialize the Internet Computer management canister actor
  let ic : IC = actor("aaaaa-aa");

  // Stable state variables
  private stable var next_id : Nat = 1; // Counter for password IDs
  private stable var password_entries : [(Nat, Password)] = []; // For upgrading
  private stable var user_password_entries : [(Principal, [Nat])] = []; // For upgrading
  private stable var user_category_entries : [(Principal, [Category])] = []; // For upgrading
  private stable var total_passwords : Nat = 0;
  private stable var total_users : Nat = 0;
  private stable var last_updated : Time.Time = 0;

  // In-memory state (will be populated from stable variables during upgrades)
  private var passwords = HashMap.HashMap<Nat, Password>(10, Nat.equal, Hash.hash);
  private var user_passwords = HashMap.HashMap<Principal, [Nat]>(10, Principal.equal, Principal.hash);
  private var user_categories = HashMap.HashMap<Principal, [Category]>(10, Principal.equal, Principal.hash);

  // Helper functions
  private func check_caller() : Principal {
    let caller = Principal.fromActor(HexLock);
    assert(not Principal.isAnonymous(caller));
    caller;
  };

  private func add_password_to_user(user : Principal, id : Nat) : Bool {
    // Check if user already exists
    switch (user_passwords.get(user)) {
      case (null) {
        // New user
        user_passwords.put(user, [id]);
        total_users := total_users + 1;
        true;
      };
      case (?ids) {
        // Existing user
        let new_ids = Array.append(ids, [id]);
        user_passwords.put(user, new_ids);
        false;
      };
    };
  };

  private func add_to_category(user : Principal, category_name : Text) : () {
    if (Text.size(category_name) == 0) {
      return;
    };
    
    let current_time = Time.now();
    let new_category : Category = {
      name = category_name;
      created_at = current_time;
    };
    
    switch (user_categories.get(user)) {
      case (null) {
        // First category for this user
        user_categories.put(user, [new_category]);
      };
      case (?categories) {
        // Check if category already exists
        var exists = false;
        label category_loop for (category in categories.vals()) {
          if (Text.equal(category.name, category_name)) {
            exists := true;
            break category_loop;
          };
        };
        
        if (not exists) {
          let new_categories = Array.append(categories, [new_category]);
          user_categories.put(user, new_categories);
        };
      };
    };
  };

  // Pre-upgrade: Save state to stable variables
  system func preupgrade() {
    password_entries := Iter.toArray(passwords.entries());
    user_password_entries := Iter.toArray(user_passwords.entries());
    user_category_entries := Iter.toArray(user_categories.entries());
  };

  // Post-upgrade: Restore state from stable variables
  system func postupgrade() {
    // Restore password map
    for ((id, password) in password_entries.vals()) {
      passwords.put(id, password);
    };
    
    // Restore user password map
    for ((user, ids) in user_password_entries.vals()) {
      user_passwords.put(user, ids);
    };
    
    // Restore user category map
    for ((user, categories) in user_category_entries.vals()) {
      user_categories.put(user, categories);
    };
    
    // Clear stable variables to free memory
    password_entries := [];
    user_password_entries := [];
    user_category_entries := [];
  };

  // Password Management API

  public shared({ caller }) func add_password(
    encrypted_name : Text,
    encrypted_username : Text,
    encrypted_password : Text,
    encrypted_url : Text,
    encrypted_notes : Text,
    category_name : Text
  ) : async Result.Result<Nat, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    
    // Generate new ID
    let id = next_id;
    next_id := next_id + 1;
    
    let current_time = Time.now();
    
    // Create password entry
    let password : Password = {
      id;
      encrypted_name;
      encrypted_username;
      encrypted_password;
      encrypted_url;
      encrypted_notes;
      category_name;
      created_at = current_time;
      updated_at = current_time;
    };
    
    // Store password
    passwords.put(id, password);
    
    // Update user's password list
    ignore add_password_to_user(caller, id);
    
    // Add category if needed
    add_to_category(caller, category_name);
    
    // Update stats
    total_passwords := total_passwords + 1;
    last_updated := current_time;
    
    #ok(id)
  };
  
  public shared query({ caller }) func get_passwords() : async Result.Result<[PasswordView], Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    
    // Get password IDs for this user
    switch (user_passwords.get(caller)) {
      case (null) {
        return #err("You have no stored passwords");
      };
      case (?ids) {
        let password_views = Buffer.Buffer<PasswordView>(ids.size());
        
        for (id in ids.vals()) {
          switch (passwords.get(id)) {
            case (?password) {
              // Convert to PasswordView
              let view : PasswordView = {
                id = password.id;
                encrypted_name = password.encrypted_name;
                encrypted_username = password.encrypted_username;
                encrypted_password = password.encrypted_password;
                encrypted_url = password.encrypted_url;
                encrypted_notes = password.encrypted_notes;
                category_name = password.category_name;
                created_at = password.created_at;
                updated_at = password.updated_at;
              };
              password_views.add(view);
            };
            case (null) { /* Skip if password was deleted */ };
          };
        };
        
        #ok(Buffer.toArray(password_views))
      };
    };
  };
  
  public shared({ caller }) func update_password(
    id : Nat,
    encrypted_name : Text,
    encrypted_username : Text,
    encrypted_password : Text,
    encrypted_url : Text,
    encrypted_notes : Text,
    category_name : Text
  ) : async Result.Result<(), Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    
    // Verify ownership
    switch (user_passwords.get(caller)) {
      case (null) {
        return #err("You have no stored passwords");
      };
      case (?ids) {
        var found = false;
        for (i in ids.vals()) {
          if (i == id) {
            found := true;
          };
        };
        
        if (not found) {
          return #err("You do not own this password");
        };
      };
    };
    
    // Get original password (for created_at time)
    switch (passwords.get(id)) {
      case (null) {
        return #err("Password not found");
      };
      case (?original) {
        // Update password
        let updated : Password = {
          id;
          encrypted_name;
          encrypted_username;
          encrypted_password;
          encrypted_url;
          encrypted_notes;
          category_name;
          created_at = original.created_at;
          updated_at = Time.now();
        };
        
        passwords.put(id, updated);
        
        // Add category if needed
        add_to_category(caller, category_name);
        
        last_updated := Time.now();
        #ok(())
      };
    };
  };
  
  public shared({ caller }) func delete_password(id : Nat) : async Result.Result<(), Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    
    // Verify ownership
    switch (user_passwords.get(caller)) {
      case (null) {
        return #err("You have no stored passwords");
      };
      case (?ids) {
        var found = false;
        for (i in ids.vals()) {
          if (i == id) {
            found := true;
          };
        };
        
        if (not found) {
          return #err("You do not own this password");
        };
        
        // Remove from passwords map
        passwords.delete(id);
        
        // Update user's password list
        let updated_ids = Array.filter<Nat>(ids, func(x) { x != id });
        user_passwords.put(caller, updated_ids);
        
        // Update stats
        total_passwords := total_passwords - 1;
        last_updated := Time.now();
        
        #ok(())
      };
    };
  };
  
  public shared query({ caller }) func get_categories() : async Result.Result<[Text], Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    
    switch (user_categories.get(caller)) {
      case (null) {
        #ok([]) // Return empty array instead of error
      };
      case (?categories) {
        // Extract category names
        let names = Array.map<Category, Text>(
          categories,
          func(cat) { cat.name }
        );
        #ok(names)
      };
    };
  };
  
  public shared query func system_stats() : async (Nat, Nat, Time.Time) {
    (total_passwords, total_users, last_updated)
  };
  
  public shared query func health_check() : async Bool {
    true // Canister is running
  };
  
  public shared query({ caller }) func get_user_info() : async (Text, Text) {
    if (Principal.isAnonymous(caller)) {
      return ("anonymous", "anonymous");
    };
    
    let principal_text = Principal.toText(caller);
    let len = Text.size(principal_text);
    
    let short_id = if (len <= 14) {
      principal_text
    } else {
      let first_part = Text.takeLeft(principal_text, 7);
      let last_part = Text.takeRight(principal_text, 7);
      first_part # "..." # last_part
    };
    
    (short_id, principal_text)
  };
  
  public shared({ caller }) func export_vault() : async Result.Result<[PasswordView], Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    
    // Simply return all the user's passwords
    await get_passwords()
  };

  // Threshold ECDSA functions for encryption key management
  
  public shared({ caller }) func public_key() : async Result.Result<{ public_key_hex : Text }, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    
    try {
      let result = await ic.ecdsa_public_key({
        canister_id = null;
        derivation_path = [Principal.toBlob(caller)];
        key_id = { curve = #secp256k1; name = "dfx_test_key" }; // Use "key_1" for production
      });
      
      #ok({ public_key_hex = blob_to_hex(result.public_key) })
    } catch (err) {
      #err(Error.message(err))
    }
  };
  
  public shared({ caller }) func sign(message : Text) : async Result.Result<{ signature_hex : Text }, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    
    try {
      let message_hash = sha256(Text.encodeUtf8(message));
      
      Cycles.add<system>(25_000_000_000); // Required cycles for sign_with_ecdsa
      let result = await ic.sign_with_ecdsa({
        message_hash;
        derivation_path = [Principal.toBlob(caller)];
        key_id = { curve = #secp256k1; name = "dfx_test_key" }; // Use "key_1" for production
      });
      
      #ok({ signature_hex = blob_to_hex(result.signature) })
    } catch (err) {
      #err(Error.message(err))
    }
  };
  
  public shared({ caller }) func derive_user_key() : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    
    let seed_message = "hexlock-key-" # Principal.toText(caller);
    
    try {
      let sig_result = await sign(seed_message);
      switch (sig_result) {
        case (#ok(result)) { #ok(result.signature_hex) };
        case (#err(msg)) { #err("Key derivation failed: " # msg) };
      }
    } catch (err) {
      #err(Error.message(err))
    }
  };
  
  // Helper functions for crypto operations
  
  private func sha256(data : Blob) : Blob {
    let hash = func(blob : Blob) : Blob {
      let h = Array.init<Nat8>(32, 0);
      let s = blob.size();
      let d = Blob.toArray(blob);

      // Simple version - in real implementation you would use IC's crypto primitives
      for (i in Iter.range(0, s - 1)) {
        h[i % 32] := h[i % 32] ^ d[i];
      };

      Blob.fromArray(Array.freeze(h))
    };
    
    hash(data)
  };
  
  private func blob_to_hex(blob : Blob) : Text {
    let hex_chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    
    let bytes = Blob.toArray(blob);
    let buffer = Buffer.Buffer<Text>(bytes.size() * 2);
    
    for (byte in bytes.vals()) {
      buffer.add(hex_chars[Nat8.toNat(byte / 16)]);
      buffer.add(hex_chars[Nat8.toNat(byte % 16)]);
    };
    
    Text.join("", Buffer.toArray(buffer))
  };
};
