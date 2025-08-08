# 🔐 HexLock - Secure Password Management System

> **Next-Generation Password Security on the Internet Computer**

HexLock is a cutting-edge password management solution built on the Internet Computer blockchain, offering enterprise-grade security with decentralized architecture. This project demonstrates advanced cryptographic techniques and modern web development practices.

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v16 or higher)
- DFX SDK
- Rust toolchain

### Installation & Setup

```bash
# Clone and navigate to project
git clone <repository-url>
cd hexlock/

# Install dependencies
npm install

# Start local development environment
dfx start --background
dfx deploy
```

## 🏗️ Architecture Overview

HexLock utilizes a sophisticated multi-canister architecture:

- **Backend Canister**: Rust-based password management logic
- **Frontend Canister**: React-based user interface
- **Authentication Layer**: Secure identity verification
- **Storage Layer**: Encrypted data persistence

## 🛠️ Development Workflow

### Backend Development
```bash
# Generate candid interfaces
npm run generate

# Deploy backend changes
dfx deploy password_manager_backend
```

### Frontend Development
```bash
# Start development server
npm start

# Access at: http://localhost:8080
```

### Production Deployment
```bash
# Deploy to mainnet
dfx deploy --network ic
```

## 📚 Key Features

- **🔒 Zero-Knowledge Architecture**: Your data never leaves your control
- **🌐 Decentralized Storage**: No single point of failure
- **⚡ Lightning Fast**: Built on Internet Computer's high-performance infrastructure
- **🛡️ Military-Grade Encryption**: AES-256 with additional security layers
- **📱 Cross-Platform**: Works on desktop, mobile, and web browsers

## 🔧 Configuration

### Environment Variables
```bash
# Development
DFX_NETWORK=local

# Production
DFX_NETWORK=ic
```

### Custom Deployment
For custom hosting environments, configure the following:

1. **Webpack Configuration**: Set `DFX_NETWORK=ic`
2. **Environment Override**: Modify `dfx.json` declarations
3. **Custom Actor**: Implement your own `createActor` constructor

## 📖 Documentation Resources

- [Internet Computer Documentation](https://internetcomputer.org/docs/current/developer-docs/)
- [Rust Canister Development](https://internetcomputer.org/docs/current/developer-docs/backend/rust/)
- [Candid Interface Language](https://internetcomputer.org/docs/current/developer-docs/backend/candid/)
- [IC-CDK Reference](https://docs.rs/ic-cdk)

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more information.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ on the Internet Computer**
