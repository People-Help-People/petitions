const fs = require("fs");
const Arweave = require("arweave");
const smartweave = require("smartweave");
require("dotenv").config();
const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 20000,
  logging: false
});

const walletPath = process.env.WALLET_LOCATION;
if (!walletPath) throw new Error("WALLET_LOCATION not specified in .env");
const contract = "php;"
if (!contract) throw new Error("Contract name not specified");

const wallet = JSON.parse(fs.readFileSync(walletPath));
const src = fs.readFileSync(`index.js`);
const state = fs.readFileSync(`init_state.json`);

async function deploy() {
  const id = await smartweave.createContract(arweave, wallet, src, state);
  console.log(`Deployed ${contract} Contract with ID ${id}`);
  await checkTxConfirmation(id);
}

async function checkTxConfirmation(txId) {
  console.log(`TxId: ${txId}\nWaiting for confirmation`);
  const start = Date.now();
  for (; ;) {
    try {
      await arweave.transactions.get(txId);
      console.log(`Transaction found`);
      return true;
    } catch (e) {
      if (e.type === "TX_FAILED") {
        console.error(e.type, "While checking tx confirmation");
        return false;
      }
    }
    console.log(Math.round((Date.now() - start) / 60000) + "m waiting");
    await sleepAsync(60000); // Wait 1m before checks to not get rate limited
  }
}

async function sleepAsync(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

(async () => await deploy())();
