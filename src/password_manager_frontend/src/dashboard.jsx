import React, { useState, useEffect } from "react"
import {
  Shield,
  Key,
  Plus,
  Search,
  Copy,
  Eye,
  EyeOff,
  User,
  RefreshCw
} from "lucide-react"
import { AuthClient } from "@dfinity/auth-client"
import { storeCredentials, getCredentials } from "./query"

function Dashboard() {
  const [showPassword, setShowPassword] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPassword, setNewPassword] = useState({
    username: "",
    password: "",
    site: ""
  })
  const [principalId, setPrincipalId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [passwords, setPasswords] = useState([])

  const filteredPasswords = passwords.filter(item =>
    item.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        setIsLoading(true)
        const authClient = await AuthClient.create()
        const isAuthenticated = await authClient.isAuthenticated()

        if (!isAuthenticated) {
          // localStorage.removeItem(LOCAL_STORAGE_KEYS.PRINCIPAL_ID)
          window.location.href = "/"
          return
        }

        // Successfully authenticated
        const identity = authClient.getIdentity()
        const principal = identity.getPrincipal()
        const principalIdString = principal.toString()

        setPrincipalId(principalIdString)
        
        // Use sessionStorage instead of localStorage for better security
        // sessionStorage.setItem(LOCAL_STORAGE_KEYS.PRINCIPAL_ID, principalIdString)

        console.log("User authenticated with principal ID:", principalIdString)
      } catch (error) {
        console.error("Authentication error")
        window.location.href = "/"
      } finally {
        setIsLoading(false)
      }
    }
    checkAuthentication()
  }, [])

  // Fetch credentials on component mount
  useEffect(() => {
    const fetchCredentials = async () => {
      if (principalId) {
        try {
          const credentials = await getCredentials(principalId )
          if (credentials) {
            console.log("Fetched credentials:", credentials)
            setPasswords(credentials)
            console.log(passwords)
            
          }
        } catch (error) {
          console.error("Error fetching credentials:", error)
        }
      }
    }

    fetchCredentials()
  }, [principalId])

  const togglePasswordVisibility = id => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const copyToClipboard = text => {
    navigator.clipboard.writeText(text)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!principalId) {
      console.error("Principal ID is not set. Cannot save credentials.");
      return;
    }

    try {
      console.log("Saving credentials:", {
        principalId,
        site: newPassword.site,
        username: newPassword.username,
        password: newPassword.password,
      });

      // Call storeCredentials to save the credentials
      await storeCredentials(
        principalId,
        newPassword.site,
        newPassword.username,
        newPassword.password
      );

      console.log("Credentials saved successfully!");

      // Close the add form and reset the input fields
      setShowAddForm(false);
      setNewPassword({
        username: "",
        password: "",
        site: "",
      });

      // Refresh the passwords list
      const updatedCredentials = await getCredentials(principalId);
      if (updatedCredentials) {
        setPasswords(updatedCredentials);
      }
    } catch (error) {
      console.error("Error saving credentials:", error);
    }
  };

  const generateRandomPassword = () => {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    const randomHex = Array.from(array)
      .map(b => b.toString(16).padStart(2, "0"))
      .join("")
    setNewPassword({ ...newPassword, password: randomHex })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          <p className="mt-4">Loading your secure vault...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-emerald-500" />
            <h1 className="text-xl font-bold">HexLock</h1>
          </div>
          <div className="relative group">
            <div className="flex items-center space-x-2 bg-gray-700 rounded-full px-4 py-2 cursor-pointer">
              <User className="w-4 h-4 text-emerald-500" />
              <span className="text-sm">Connected</span>
            </div>
            <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg p-4 hidden group-hover:block border border-gray-700">
              <p className="text-sm text-gray-400">Principal ID:</p>
              <p className="text-sm font-mono overflow-hidden text-ellipsis">
                {principalId || "Not authenticated"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search passwords..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg ml-4"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-5 h-5" />
            <span>Add New</span>
          </button>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New Password</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      URL
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-emerald-500"
                      value={newPassword.site}
                      onChange={e =>
                        setNewPassword({ ...newPassword, site: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-emerald-500"
                      value={newPassword.username}
                      onChange={e =>
                        setNewPassword({
                          ...newPassword,
                          username: e.target.value
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Password
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-emerald-500"
                        value={newPassword.password}
                        onChange={e =>
                          setNewPassword({
                            ...newPassword,
                            password: e.target.value
                          })
                        }
                        required
                      />
                      <button
                        type="button"
                        onClick={generateRandomPassword}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center"
                        title="Generate random password"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-xl border border-gray-700">
          {filteredPasswords.map((item, index) => (
            <div
              key={index}
              className="p-4 border-b border-gray-700 last:border-0 hover:bg-gray-750"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Key className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className="font-medium text-gray-300">{item.site}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(item.username)}
                    className="p-2 hover:bg-gray-700 rounded-lg"
                    title="Copy username"
                  >
                    <User className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(item.password)}
                    className="p-2 hover:bg-gray-700 rounded-lg"
                    title="Copy password"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => togglePasswordVisibility(index)}
                    className="p-2 hover:bg-gray-700 rounded-lg"
                    title="Toggle password visibility"
                  >
                    {showPassword[index] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div className="text-sm">
                  <span className="text-gray-400">Username: </span>
                  {item.username}
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">Password: </span>
                  {showPassword[index] ? item.password : "••••••••"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
