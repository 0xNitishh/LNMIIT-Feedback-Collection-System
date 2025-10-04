# LNMIIT Faculty Feedback Collection Software

A fully decentralized application (dApp) built on the Ethereum Sepolia testnet that allows students to securely and anonymously submit faculty feedback. The platform ensures data integrity and prevents duplicate submissions by leveraging a Solidity smart contract.

## ✨ Features
1. Wallet Integration: Securely connect and disconnect using a MetaMask wallet.
2. On-Chain Data: All feedback submissions (professor, semester, and individual ratings) are permanently stored on the blockchain.
3. Prevents Duplicate Submissions: A student cannot submit feedback for the same professor in the same semester more than once.
4. Real-time Calculations: The frontend dynamically calculates the average rating as the user provides feedback.
5. Transparent & Verifiable: Every submission generates a transaction hash that can be viewed on a block explorer like Etherscan.

## 🛠️ Tech Stack
Frontend: HTML5, CSS3, JavaScript (ES6+), Ethers.js v5
Blockchain: Solidity, Ethereum (Sepolia Testnet)
Development Tools: Remix IDE, VS Code, Live Server

## 🚀 Getting Started
To run this project locally, follow these steps.

### Prerequisites
1. A web browser with the MetaMask extension installed.
2. Some free Sepolia test ETH from a faucet like sepoliafaucet.com.

### Installation & Setup
1. Clone the Repository

2. Bash
git clone [Your Repository URL]
cd [Your Repository Folder]
Deploy the Smart Contract

3. Open Remix IDE.
Copy the code from FeedbackContract.sol into a new file in Remix.
Compile the contract.
In the "Deploy" tab, select "Injected Provider - MetaMask" and connect your wallet (ensure you're on the Sepolia network).
Deploy the contract and copy the deployed contract address and the ABI.

4. Configure the Frontend
Open the script.js file.
Paste the deployed contract address and ABI into the contractAddress and contractABI variables at the top of the file.

5. Run the Application
If you're using VS Code, install the Live Server extension.
Right-click on index.html and select "Open with Live Server".

The application will open in your default browser.

## 📖 Usage
Visit the landing page and click "Connect Wallet".
Once connected, click "Provide feedback".
On the feedback form, select the current semester and the faculty member.
Provide a rating from 1 to 5 for all 10 questions. The average rating will update dynamically.
Click "Submit" and confirm the transaction in the MetaMask pop-up.
Upon success, you will be redirected to a confirmation page with a link to your transaction on Etherscan.

## Future Plans

1. Implement Zero-Knowledge Proofs for additional privacy so that even the wallet address cannot be revealed and even then the verification of a student can be performed.
2. Enhance the software so that it can be used on multiple platforms apart from feedback collection for student-faculty only.

## 
## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
