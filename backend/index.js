const fs = require("fs");
const Web3 = require("web3").default;
require("dotenv").config();
const prompt = require("prompt-sync")();
const csv = require("csv-parser");

const PRIVATE_KEY =
  "0x11801d50acb2f19d36d83186500b042750abbe7aaf37cd443ce23672e42c57f6";
const CONTRACT_ADDRESS = "0x14DE250fedB2bd634d5Be8DF4b040aB1ce025862";
const GANACHE_URL = "http://127.0.0.1:7545";

const web3 = new Web3(GANACHE_URL);
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

const contractArtifact = require("../build/contracts/SystemIntegrity.json");
const contract = new web3.eth.Contract(contractArtifact.abi, CONTRACT_ADDRESS);

function getCurrentHash() {
    return fs.readFileSync("C:/integrity/final_hash.txt", "utf-8").trim();
}

async function verifyHashWithBlockchain() {
    const storedHash = await contract.methods.getHash().call();
    const currentHash = getCurrentHash();

    const valid = storedHash === currentHash;
    console.log("📊 Hash Comparison Result:", valid ? "✅ Match" : "❌ Mismatch");

    if (!valid) {
        console.log("⚠️ Alert: Potential integrity violation!");

        const logPath = "C:/integrity/intrusion_log.txt";
        if (fs.existsSync(logPath)) {
            const logContent = fs.readFileSync(logPath, "utf-8");
            const recent = logContent.trim().split("\n\n").pop();

            console.log("🚨 Suspicious Activity Detected:\n", recent);

            const blockSim = `🔒 Simulated Block >>\n${recent}\nTime: ${new Date().toLocaleString()}\n\n`;
            fs.appendFileSync("C:/integrity/block_log.txt", blockSim, "utf-8");

            console.log("🛡️ Simulated response: User/process has been 'blocked'. Logged to block_log.txt");
        }
    }
}

async function storeCurrentHashToBlockchain() {
    const currentHash = getCurrentHash();

    await contract.methods.storeHash(currentHash).send({
        from: account.address,
        gas: 100000,
    });

    fs.copyFileSync("C:/integrity/system_hashes.csv", "C:/integrity/system_hashes_backup.csv");
    console.log("✅ Hash successfully stored on blockchain.");
    console.log("🗂️ Backup of system_hashes.csv saved.");
}

async function main() {
    const mode = process.argv[2];
    if (mode === "auto") {
        console.log("🔁 Auto-mode hash check running...");
        await verifyHashWithBlockchain();
        return;
    }

    while (true) {
        console.log("\n=== 🛡️ SYSTEM INTEGRITY CHECKER ===");
        console.log("1. Store current Sysmon hash to blockchain");
        console.log("2. Verify current Sysmon hash with blockchain");
        console.log("3. Exit");
        const choice = prompt("Enter choice: ");

        if (choice === "1") {
            await storeCurrentHashToBlockchain();
        } else if (choice === "2") {
            await verifyHashWithBlockchain();
        } else {
            break;
        }
    }
}

main();