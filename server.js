import express from "express";
import bodyParser from "body-parser";
import { Gateway, Wallets } from "fabric-network";
import path from "path";
import fs from "fs";

const app = express();
app.use(bodyParser.json());

// Utility: connect to Fabric and get contract
async function getContract() {
  const ccpPath = path.resolve(
    "..",
    "..",
    "fabric-samples",
    "test-network",
    "organizations",
    "peerOrganizations",
    "org1.example.com",
    "connection-org1.yaml"
  );
  const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

  const wallet = await Wallets.newFileSystemWallet("wallet");
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: "appUser",
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork("mychannel");
  const contract = network.getContract("LoanContract");
  return { contract, gateway };
}

// ----------- ROUTES -------------

// Init Ledger
app.post("/api/init", async (req, res) => {
  try {
    const { contract, gateway } = await getContract();
    await contract.submitTransaction("initLedger");
    await gateway.disconnect();
    res.json({ message: "Ledger initialized successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register Loan
app.post("/api/loans", async (req, res) => {
  const { id, amount, borrower, lender, interestRate } = req.body;
  try {
    const { contract, gateway } = await getContract();
    await contract.submitTransaction(
      "registerLoan",
      id,
      amount,
      borrower,
      lender,
      interestRate
    );
    await gateway.disconnect();
    res.json({ message: `Loan ${id} registered successfully.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Loan Amount
app.put("/api/loans/:id/amount", async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  try {
    const { contract, gateway } = await getContract();
    await contract.submitTransaction("updateLoanAmount", id, amount);
    await gateway.disconnect();
    res.json({ message: `Loan ${id} amount updated to ${amount}.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Loan Interest Rate
app.put("/api/loans/:id/interest", async (req, res) => {
  const { id } = req.params;
  const { interestRate } = req.body;
  try {
    const { contract, gateway } = await getContract();
    await contract.submitTransaction("updateLoanInterestRate", id, interestRate);
    await gateway.disconnect();
    res.json({ message: `Loan ${id} interest updated to ${interestRate}.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve Loan
app.post("/api/loans/:id/approve", async (req, res) => {
  const { id } = req.params;
  try {
    const { contract, gateway } = await getContract();
    await contract.submitTransaction("approveLoan", id);
    await gateway.disconnect();
    res.json({ message: `Loan ${id} approved.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject Loan
app.post("/api/loans/:id/reject", async (req, res) => {
  const { id } = req.params;
  try {
    const { contract, gateway } = await getContract();
    await contract.submitTransaction("rejectLoan", id);
    await gateway.disconnect();
    res.json({ message: `Loan ${id} rejected.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Loan by ID
app.get("/api/loans/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { contract, gateway } = await getContract();
    const result = await contract.evaluateTransaction("getLoanById", id);
    await gateway.disconnect();
    res.json(JSON.parse(result.toString()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------- START SERVER -----------
app.listen(3000, () =>
  console.log("🚀 Backend running on http://localhost:3000")
);
