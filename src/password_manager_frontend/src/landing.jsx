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

const HexLockLogo = ({ className = "h-8 w-8" }) => (
  <svg
    className={`${className} animate-glow`}
    viewBox="0 0 1000 1000"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M500 100C276.142 100 94.8066 281.336 94.8066 505.194C94.8066 729.052 276.142 910.387 500 910.387C723.858 910.387 905.193 729.052 905.193 505.194C905.193 281.336 723.858 100 500 100ZM500 175.097C682.649 175.097 830.097 322.545 830.097 505.194C830.097 687.843 682.649 835.29 500 835.29C317.351 835.29 169.903 687.843 169.903 505.194C169.903 322.545 317.351 175.097 500 175.097Z" />
    <path d="M500 250.194C358.748 250.194 244.806 364.136 244.806 505.388C244.806 646.64 358.748 760.581 500 760.581C641.252 760.581 755.194 646.64 755.194 505.388C755.194 364.136 641.252 250.194 500 250.194ZM500 325.29C599.903 325.29 680.097 405.485 680.097 505.388C680.097 605.291 599.903 685.485 500 685.485C400.097 685.485 319.903 605.291 319.903 505.388C319.903 405.485 400.097 325.29 500 325.29Z" />
    <circle cx="500" cy="505" r="75" />
    <path d="M500 400C447.5 400 405 442.5 405 495C405 547.5 447.5 590 500 590C552.5 590 595 547.5 595 495C595 442.5 552.5 400 500 400ZM500 440C530.5 440 555 464.5 555 495C555 525.5 530.5 550 500 550C469.5 550 445 525.5 445 495C445 464.5 469.5 440 500 440Z" />
  </svg>
)

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
      className={`fixed w-full z-50 transition-all duration-300 ${
        isDarkMode ? "bg-[#1a1f2e]" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <HexLockLogo
                className={`h-8 w-8 ${
                  isDarkMode ? "text-[#4169e1]" : "text-[#2851db]"
                } transition-transform duration-300 group-hover:scale-110`}
              />
              <span
                className={`text-xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                HexLock
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {principalId && (
              <span
                className={`hidden md:block text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                ID: {principalId.substring(0, 5)}...
                {principalId.substring(principalId.length - 5)}
              </span>
            )}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                isDarkMode
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
                className="text-white bg-[#4169e1] hover:bg-[#2851db] px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
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
    className={`p-6 rounded-xl ${
      isDarkMode ? "bg-[#242937]" : "bg-white"
    } shadow-lg feature-card`}
  >
    <div className="w-12 h-12 bg-[#4169e1] rounded-lg flex items-center justify-center mb-4 animate-float">
      <Icon className="h-6 w-6 text-white" />
    </div>
    <h3
      className={`text-xl font-semibold mb-2 ${
        isDarkMode ? "text-white" : "text-gray-900"
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
      className={`min-h-screen pt-16 ${
        isDarkMode ? "bg-[#1a1f2e]" : "bg-gray-50"
      }`}
    >
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="reveal">
            <h1
              className={`text-5xl font-bold mb-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Secure Passwords on the{" "}
              <span className="text-[#4169e1] animate-glow">
                Internet Computer
              </span>
            </h1>
            <p
              className={`text-xl mb-8 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              } max-w-3xl mx-auto`}
            >
              Revolutionary password management powered by Internet Computer
              Protocol. Your credentials, secured by blockchain technology.
            </p>
          </div>
        </div>
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
                className={`text-3xl font-bold mb-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Enterprise-Grade Security
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Code className="h-6 w-6 text-[#4169e1] mt-1" />
                  <div>
                    <h3
                      className={`text-xl font-semibold mb-2 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ICP Smart Contracts
                    </h3>
                    <p
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Powered by secure smart contracts on the Internet Computer
                      Protocol.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Shield className="h-6 w-6 text-[#4169e1] mt-1" />
                  <div>
                    <h3
                      className={`text-xl font-semibold mb-2 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Military-Grade Encryption
                    </h3>
                    <p
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      AES-256 encryption ensures your data remains private and
                      secure.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Database className="h-6 w-6 text-[#4169e1] mt-1" />
                  <div>
                    <h3
                      className={`text-xl font-semibold mb-2 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Decentralized Storage
                    </h3>
                    <p
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
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
                src="/src/assets/image.jpg"
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

      .animate-float {
        animation: float 4s ease-in-out infinite;
      }

      @keyframes glow {
        0% { filter: drop-shadow(0 0 2px rgba(65, 105, 225, 0.5)); }
        50% { filter: drop-shadow(0 0 8px rgba(65, 105, 225, 0.8)); }
        100% { filter: drop-shadow(0 0 2px rgba(65, 105, 225, 0.5)); }
      }

      .animate-glow {
        animation: glow 3s ease-in-out infinite;
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
