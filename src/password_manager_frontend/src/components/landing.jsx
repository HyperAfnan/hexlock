import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import logo from "/logo.jpg";
import cipherBox from "/cipher-box.jpg";

const features = [
  {
    title: "Enhanced Security",
    description: "Generate and store strong, unique passwords for all your accounts, ensuring maximum protection against cyber threats.",
    icon: "🔒",
  },
  {
    title: "Cross-Platform Compatibility",
    description: "Access your passwords seamlessly across all devices, including smartphones, tablets, and computers.",
    icon: "💻",
  },
  {
    title: "Secure Password Sharing",
    description: "Share your passwords securely with trusted individuals without compromising your security.",
    icon: "🔗",
  },
  {
    title: "Two-Factor Authentication",
    description: "Add an extra layer of security to your accounts with integrated two-factor authentication.",
    icon: "⚙️",
  },
  {
    title: "Decentralized Security",
    description: "Data is stored across multiple nodes, reducing the risk of a single point of failure and making it harder for hackers to breach.",
    icon: "🛡️",
  },
];

const pros = [
  {
    title: "Ease of Use",
    description: "Password managers make it unnecessary to remember multiple passwords. They are easily accessible and quick to load.",
    source: "https://www.kelsercorp.com/blog/password-managers-pros-cons-advantages-disadvantages",
  },
  {
    title: "Enhanced Security",
    description: "Beyond security, password managers provide several organizational benefits that improve efficiency and safety.",
    source: "https://teampassword.com/blog/password-manager-pros-and-cons",
  },
  {
    title: "Cross-Platform Accessibility",
    description: "Access your passwords from all devices, ensuring you have your credentials whenever and wherever you need them.",
    source: "https://teampassword.com/blog/password-manager-pros-and-cons",
  },
];

const Landing = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLoginClick = () => {
    navigate("/auth"); // Redirect to the Auth component
  };

  return (
    <div className="font-sans bg-gray-900 text-white min-h-screen flex flex-col items-center">
      {/* Header Section */}
      <header className="w-full flex justify-between items-center p-6 max-w-[1200px]">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="HexLock Logo" width={50} height={50} className="rounded-full" />
          <h1 className="text-2xl font-bold">HexLock</h1>
        </div>
        <button
          className="bg-blue-500 px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
          onClick={handleLoginClick} // Add onClick handler
        >
          Login
        </button>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between w-full max-w-[1200px] p-6">
        <div className="lg:w-1/2 text-center lg:text-left">
          <motion.h1
            className="text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            The Best Way to Secure Your Data
          </motion.h1>
          <motion.p
            className="text-lg mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Secure your passwords with advanced encryption and seamless accessibility.
          </motion.p>

          {/* Key Features (Stacked vertically, spacing unchanged) */}
          <motion.div
            className="text-2xl font-semibold text-center lg:text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="mb-2">Safe and Secure</div>
            <div className="mb-2">User-Friendly</div>
            <div>Privacy-Focused</div>
          </motion.div>
        </div>

        {/* Image Section */}
        <motion.div
          className="lg:w-1/2 flex justify-center mt-6 lg:mt-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <img src={cipherBox} alt="Cipher Box Screenshot" className="rounded-lg shadow-lg w-full lg:w-[90%]" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-[1200px] mt-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose HexLock?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 bg-gray-800 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold flex items-center space-x-2">
                <span className="text-2xl">{feature.icon}</span>
                <span>{feature.title}</span>
              </h3>
              <p className="text-gray-400 mt-2">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pros Section */}
      <section className="w-full max-w-[1200px] mt-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Benefits of Using a Password Manager</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pros.map((pro, index) => (
            <motion.div
              key={index}
              className="p-6 bg-gray-800 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold">{pro.title}</h3>
              <p className="text-gray-400 mt-2">{pro.description}</p>
              <a
                href={pro.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline mt-2 block"
              >
                Learn more
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full text-center p-6 mt-12 text-gray-500">
        © 2025 HexLock. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;