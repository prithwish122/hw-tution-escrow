# 📘 Tuitly — Tuition Escrow Platform

**Tuitly** is a decentralized escrow platform designed to facilitate trustless, milestone-based payments between students and tutors. It ensures that funds are only released once educational milestones are met, protecting both parties from fraud and misaligned expectations.

---

## 🚀 Features

- 🔐 Escrow-based smart contract for secure transactions  
- 🧑‍🏫 Milestone-driven release of funds  
- 📜 Transparent and immutable smart contract logic  
- ⚡ Easy-to-use interface for both students and tutors  

---

## 🛠 How to Run Locally

### Prerequisites

- Node.js (v16+ recommended)
- Yarn or npm
- Hardhat
- MetaMask or any Web3 wallet

### 1. Clone the Repository

```bash
git clone https://github.com/prithwish122/hw-tution-escrow.git
cd contract
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Compile the Smart Contracts

```bash
npx hardhat compile
```

### 4. Start a Local Hardhat Node (Optional for Testing)

```bash
npx hardhat node
```

### 5. Deploy Contracts Locally

```bash
npx hardhat run scripts/deploy_deploy_testUSDC.js --network opencampus
npx hardhat run scripts/deploy_escrow.js --network opencampus
```

### 6. Start the Frontend

```bash
cd client
npm install --force
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to access the application.

---

## 📄 Smart Contract

### 🔗 Contract Address

TestUSDC = https://edu-chain-testnet.blockscout.com/token/0xE848aDaDC71b7373639e4EbeC1E81331731F5Dad

Escrow = https://edu-chain-testnet.blockscout.com/address/0x92146cca0FCA743CE512D5B1791668e01eb48963

### 🧠 ABI

The ABI is located at:

```
client\contractdetails
```

Or you can copy the ABI from the deployment output after running the deployment script.

---

## 📌 Assumptions

- Tutors and students must agree on a set of milestones before initiating an escrow.
- Funds are locked in the escrow smart contract at the start.
- Only the student can approve a milestone's completion to release payment.
- If a dispute arises, a manual arbitration mechanism (e.g., admin intervention or DAO) may be added in the future.
- The platform currently supports only one active escrow per tutor-student pair.

---

## 📬 Feedback & Contributions

We welcome feedback, suggestions, and contributions to improve **Tuitly**. Please open issues or submit pull requests to contribute.

---

## 🛡 License

This project is licensed under the MIT License.
