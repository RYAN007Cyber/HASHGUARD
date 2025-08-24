# HASHGUARD

HASHGUARD is a Blockchain-Integrated Detection and Prevention System (BIDPS) designed to enhance cybersecurity under a Zero Trust architecture. It combines Sysmon for event logging, PowerShell for hash generation, Ethereum blockchain for hash validation, and AI-based anomaly detection.

## 🔐 Key Features

- **Sysmon Logging**: Captures detailed system activity.
- **PowerShell Hashing**: Generates file hashes for integrity checks.
- **Blockchain Verification**: Uses a private Ethereum blockchain to validate file hashes.
- **AI Detection**: Employs a Random Forest model to detect anomalies and potential threats.
- **Zero Trust Security**: Operates under a strict verification model for all components.

## 🛠️ Prerequisites

- Windows 10/11 with admin rights
- Node.js and npm
- MetaMask browser extension
- Ganache (for local Ethereum testing)
- Basic knowledge of PowerShell and Command Prompt

## 🚀 Installation Guide

1. **Prepare System**
   - Create working directory (e.g., `C:\BIDPS`)
   - Ensure firewall allows Ganache and Next.js communication

2. **Install Sysmon**
   - Download Sysmon and config file (e.g., `sysmonconfig-export.xml`)
   - Run Sysmon with config using Command Prompt as Administrator

3. **Blockchain Setup**
   - Launch Ganache
   - Deploy smart contract (`SystemIntegrity.sol`) using Truffle or Hardhat
   - Connect MetaMask to local blockchain

4. **Run Client**
   - Navigate to `client/` folder
   - Install dependencies: `npm install`
   - Start app: `npm run dev`

5. **Run Backend**
   - Navigate to `backend/` folder
   - Start server: `node server.js`

## 📂 Project Structure

HASHGUARD/
├── client/         # Frontend (Next.js)
├── backend/        # Backend (Node.js)
├── contracts/      # Smart contracts (Solidity)
├── migrations/     # Deployment scripts
├── README.md       # Project documentation
└── .gitignore      # Git exclusions


Steps:
Blockchain Setup

Launch Ganache
Deploy smart contract (SystemIntegrity.sol) using Truffle or Hardhat
Connect MetaMask to local blockchain

Run Client
cd client
npm install
npm run dev

Run Backend
cd backend
node server.js
