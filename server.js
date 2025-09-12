const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const ccpPath = path.resolve(
  __dirname,
  "..",
  "..",
  "fabric-samples",
  "test-network",
  "organizations",
  "peerOrganizations",
  "org1.example.com",
  "connection-org1.json"
);

async function getContract() {
  const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
  const walletPath = path.join(process.cwd(), "wallet");
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: "appUser",
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork("mychannel");
  const contract = network.getContract("LoanContract");
  return contract;
}

// Init Ledger
app.post("/initLedger", async (req, res) => {
  try {
    const contract = await getContract();
    await contract.submitTransaction("initLedger");
    res.json({ message: "Ledger initialized successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register Loan
app.post("/registerLoan", async (req, res) => {
  try {
    const { id, amount, borrower, lender, rate } = req.body;
    const contract = await getContract();
    const result = await contract.submitTransaction(
      "registerLoan",
      id,
      amount,
      borrower,
      lender,
      rate
    );
    res.json(JSON.parse(result.toString()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Loan Agreement
app.post("/createLoanAgreement", async (req, res) => {
  try {
    const { id } = req.body;
    const contract = await getContract();
    const result = await contract.submitTransaction("createLoanAgreement", id);
    res.json(JSON.parse(result.toString()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Loan Amount
app.put("/updateLoanAmount/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { newAmount } = req.body;
    const contract = await getContract();
    const result = await contract.submitTransaction(
      "updateLoanAmount",
      id,
      newAmount
    );
    res.json(JSON.parse(result.toString()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Loan Interest Rate
app.put("/updateLoanRate/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { newRate } = req.body;
    const contract = await getContract();
    const result = await contract.submitTransaction(
      "updateLoanInterestRate",
      id,
      newRate
    );
    res.json(JSON.parse(result.toString()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Loan By ID
app.get("/loan/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await getContract();
    const result = await contract.evaluateTransaction("getLoanById", id);
    res.json(JSON.parse(result.toString()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
