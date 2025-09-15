const express = require("express");

const cors = require("cors"); //CORS = Cross-Origin Resource Sharing.
//By default, browsers block a website (say, http://localhost:5500) from calling a server on a different port (http://localhost:3000).
//cors() tells the server: “It’s okay for other origins (like your frontend) to make requests here.”

const bodyParser = require("body-parser"); //converts JSON Req to Java Object (so we can do req.body as java object).

const { Gateway, Wallets } = require("fabric-network"); //Import objects from Hyperledger Fabric SDK:Gateway: connects your app to the blockchain network.Wallets: manages user identities (like appUser).

const path = require("path"); //Node.js module to work with file paths (safe across OS).
const fs = require("fs"); //Node.js module to read/write files.

const app = express(); //creates express application
app.use(cors());
app.use(bodyParser.json());

// Connection profile path
const ccpPath = path.resolve(
  process.cwd(),
  "..",
  "..",
  "fabric-samples",
  "test-network",
  "organizations",
  "peerOrganizations",
  "org1.example.com",
  "connection-org1.yaml"
);

// === Helper to wrap chaincode responses safely ===
function safeResponse(result, successMsg) {
  if (!result || result.length === 0) {
    return { message: successMsg }; //Empty result ≠ failure.It just means “this transaction doesn’t produce output.”
  }
  const str = result.toString();
  try {
    return JSON.parse(str);
  } catch {
    return { message: successMsg, data: str };
  }
}

// === Get contract instance ===
async function getContract() {
  const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
  const wallet = await Wallets.newFileSystemWallet("wallet");

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: "appUser",
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork("mychannel");
  return network.getContract("LoanContract");
}

// === Routes ===

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
    res.json(safeResponse(result, "Loan registered successfully"));
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
    res.json(safeResponse(result, "Loan agreement created successfully"));
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
    res.json(safeResponse(result, "Loan amount updated successfully"));
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
    res.json(safeResponse(result, "Loan interest rate updated successfully"));
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
    res.json(JSON.parse(result.toString())); // always JSON here
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
