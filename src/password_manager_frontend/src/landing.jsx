import { useState, useEffect } from "react"
import {
   Moon,
   Sun,
   Shield,
   Key,
   Globe,
   RefreshCw,
   Fingerprint,
   Database,
   Code
} from "lucide-react"
import { Link, Routes, Route } from "react-router-dom"
import { AuthClient } from "@dfinity/auth-client"

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
   const [isAuthenticated, setIsAuthenticated] = useState(false)
   const [principalId, setPrincipalId] = useState(null)

   const handleAuthentication = async () => {
      try {
         const authClient = await AuthClient.create()
         await authClient.login({
            identityProvider: "https://identity.ic0.app/#authorize",
            maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
            onSuccess: () => {
               const identity = authClient.getIdentity()
               const principal = identity.getPrincipal()
               setPrincipalId(principal.toString())
               setIsAuthenticated(true)
               window.location.href = "/dashboard"
            }
         })
      } catch (error) {
         console.error("Authentication error:", error)
      }
   }

   const handleLogout = async () => {
      try {
         const authClient = await AuthClient.create()
         await authClient.logout()
         setPrincipalId(null)
         setIsAuthenticated(false)
         window.location.href = "/"
      } catch (error) {
         console.error("Logout error:", error)
      }
   }

   return (
      <nav
         className={`fixed w-full z-50 transition-all duration-300 ${isDarkMode ? "bg-[#1a1f2e]" : "bg-white"
            }`}
      >
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
               <div className="flex items-center">
                  <Link to="/" className="flex items-center space-x-2 group">
                     <Shield className="w-8 h-8 text-emerald-500" />
                     <span
                        className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"
                           }`}
                     >
                        HexLock
                     </span>
                  </Link>
               </div>
               <div className="flex items-center space-x-4">
                  {principalId && (
                     <span
                        className={`hidden md:block text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"
                           }`}
                     >
                        ID: {principalId.substring(0, 5)}...
                        {principalId.substring(principalId.length - 5)}
                     </span>
                  )}
                  <button
                     onClick={toggleDarkMode}
                     className={`p-2 rounded-full ${isDarkMode
                        ? "bg-gray-800 text-gray-200"
                        : "bg-gray-100 text-gray-800"
                        } hover:opacity-80 transition-all duration-300`}
                  >
                     {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                  {isAuthenticated ? (
                     <button
                        onClick={handleLogout}
                        className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
                     >
                        Logout
                     </button>
                  ) : (
                     <button
                        onClick={handleAuthentication}
                        className="text-white bg-emerald-500 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
                     >
                        Login
                     </button>
                  )}
               </div>
            </div>
         </div>
      </nav>
   )
}

const Feature = ({ icon: Icon, title, description, isDarkMode }) => (
   <div
      className={`p-6 rounded-xl ${isDarkMode ? "bg-[#242937]" : "bg-white"
         } shadow-lg feature-card`}
   >
      <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-4 animate-float">
         <Icon className="h-6 w-6 text-white" />
      </div>
      <h3
         className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
            }`}
      >
         {title}
      </h3>
      <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
         {description}
      </p>
   </div>
)

const LandingContent = ({ isDarkMode }) => {
   useEffect(() => {
      const handleScroll = () => {
         const reveals = document.querySelectorAll(".reveal")
         reveals.forEach(element => {
            const windowHeight = window.innerHeight
            const elementTop = element.getBoundingClientRect().top
            const elementVisible = 150

            if (elementTop < windowHeight - elementVisible) {
               element.classList.add("active")
            }
         })
      }

      window.addEventListener("scroll", handleScroll)
      handleScroll()
      return () => window.removeEventListener("scroll", handleScroll)
   }, [])

   return (
      <div
         className={`min-h-screen pt-16 ${isDarkMode ? "bg-[#1a1f2e]" : "bg-gray-50"
            }`}
      >
         <div className="pt-24 pb-16 px-4">
            <div className="max-w-7xl mx-auto text-center">
               <div className="reveal">
                  <h1
                     className={`text-5xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                  >
                     Secure Passwords on the{" "}
                     <span className="text-emerald-400 ">
                        Internet Computer
                     </span>
                  </h1>
                  <p
                     className={`text-xl mb-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"
                        } max-w-3xl mx-auto`}
                  >
                     Revolutionary password management powered by Internet Computer
                     Protocol. Your credentials, secured by blockchain technology.
                  </p>
               </div>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center px-4">
            <span className="text-4xl md:text-5xl font-bold text-white text-center md:text-left md:mr-8 md:ml-8">
               Decentralized Security
               <br />
               Powered by ICP
            </span>
            <img
               src="./src/assets/dashboard.png"
               alt="hexlock dashboard"
               className="h-auto w-full max-w-xs mx-auto md:max-w-sm md:justify-self-end rounded-lg"
            />
         </div>
         <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 reveal">
               <Feature
                  icon={Shield}
                  title="Zero-Knowledge Encryption"
                  description="Your data is encrypted before it leaves your device. We can't access your passwords."
                  isDarkMode={isDarkMode}
               />
               <Feature
                  icon={Database}
                  title="Blockchain Storage"
                  description="Passwords are stored on the decentralized Internet Computer Protocol."
                  isDarkMode={isDarkMode}
               />
               <Feature
                  icon={Fingerprint}
                  title="Biometric Authentication"
                  description="Use fingerprint or face recognition for quick access."
                  isDarkMode={isDarkMode}
               />
               <Feature
                  icon={Key}
                  title="Password Generator"
                  description="Create strong, unique passwords with our advanced generator."
                  isDarkMode={isDarkMode}
               />
               <Feature
                  icon={RefreshCw}
                  title="Auto-Sync"
                  description="Changes sync instantly across all your devices."
                  isDarkMode={isDarkMode}
               />
               <Feature
                  icon={Globe}
                  title="Cross-Platform"
                  description="Available on all major platforms and browsers."
                  isDarkMode={isDarkMode}
               />
            </div>
         </div>

         <div className={`py-16 ${isDarkMode ? "bg-[#242937]" : "bg-white"}`}>
            <div className="max-w-7xl mx-auto px-4">
               <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="reveal">
                     <h2
                        className={`text-3xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"
                           }`}
                     >
                        Enterprise-Grade Security
                     </h2>
                     <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                           <Code className="h-6 w-6 text-emerald-400 mt-1" />
                           <div>
                              <h3
                                 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
                                    }`}
                              >
                                 ICP Smart Contracts
                              </h3>
                              <p
                                 className={`${isDarkMode ? "text-gray-400" : "text-gray-600"
                                    }`}
                              >
                                 Powered by secure smart contracts on the Internet Computer
                                 Protocol.
                              </p>
                           </div>
                        </div>
                        <div className="flex items-start space-x-4">
                           <Shield className="h-6 w-6 text-emerald-500 mt-1" />
                           <div>
                              <h3
                                 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
                                    }`}
                              >
                                 Military-Grade Encryption
                              </h3>
                              <p
                                 className={`${isDarkMode ? "text-gray-400" : "text-gray-600"
                                    }`}
                              >
                                 AES-256 encryption ensures your data remains private and
                                 secure.
                              </p>
                           </div>
                        </div>
                        <div className="flex items-start space-x-4">
                           <Database className="h-6 w-6 text-emerald-500 mt-1" />
                           <div>
                              <h3
                                 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
                                    }`}
                              >
                                 Decentralized Storage
                              </h3>
                              <p
                                 className={`${isDarkMode ? "text-gray-400" : "text-gray-600"
                                    }`}
                              >
                                 No single point of failure. Your data is distributed
                                 across the network.
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="reveal">
                     <img
                        src="./src/assets/image.jpg"
                        alt="Security Dashboard"
                        className="rounded-lg shadow-xl transition-transform duration-300 hover:scale-105"
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

function LandingPage() {
   const [isDarkMode, setIsDarkMode] = useState(true)

   const toggleDarkMode = () => {
      setIsDarkMode(!isDarkMode)
   }

   useEffect(() => {
      const style = document.createElement("style")
      style.innerHTML = `
      .reveal {
        position: relative;
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
      }

      .reveal.active {
        opacity: 1;
        transform: translateY(0);
      }

      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }


    `
      document.head.appendChild(style)

      return () => {
         document.head.removeChild(style)
      }
   }, [])

   return (
      <div
         className={`min-h-screen ${isDarkMode ? "bg-[#1a1f2e]" : "bg-gray-50"}`}
      >
         <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
         <Routes>
            <Route path="/" element={<LandingContent isDarkMode={isDarkMode} />} />
         </Routes>
      </div>
   )
}

export default LandingPage
