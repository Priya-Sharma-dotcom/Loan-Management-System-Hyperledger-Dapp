//The API is the collection of routes (endpoints) handled by Express (like /registerLoan, /getLoanById/:id, etc.)

const express = require("express");
const yaml= require("js-yaml");

const cors = require("cors"); //CORS = Cross-Origin Resource Sharing.
//By default, browsers block a website (say, http://localhost:5500) from calling a server on a different port (http://localhost:3000).
//cors() tells the server: “It’s okay for other origins (like your frontend) to make requests here.”

const bodyParser = require("body-parser"); //converts JSON Req to Java Object as body:JSON.stringify gives JSON result,(so to put that Json String in res.body as java object)body parser is used.

const { Gateway, Wallets } = require("fabric-network"); //Import objects from Hyperledger Fabric SDK:Gateway: connects your app to the blockchain network.Wallets: manages user identities (like appUser).

const path = require("path"); //Node.js module to work with file paths (safe across OS).
const fs = require("fs"); //Node.js module to read/write files.

const app = express(); //creates express application= instance of express web server
app.use(cors());
app.use(bodyParser.json());


// Connection profile path  =====Common Connection Profile, which contains:Peer addresses,CA info,TLS options,Org configs✅ This profile tells your app how to connect to the Fabric network=====
const ccpPath = path.resolve(
  process.cwd(),    //current working directory
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
    return { message: successMsg }; //Empty result ≠ failure.It just means “this transaction doesn’t produce output like POST ”
  }
  const str = result.toString();           //If result exists, convert it to a string.Hyperledger Fabric often returns a Buffer, so this ensures it's readable (e.g., from binary to text).
  try {                                //Try converting string to JS object
    return JSON.parse(str);                //if result is JSON, convert JSON String to Java Object as When Hyperledger Fabric or any API sends back a JSON string , we convert it tp java to do  javascript operations like :res.json({ id: "L001", amount: "10000" })
  } catch {                           // If it fails, return raw string
    return { message: successMsg, data: str };     //If result is a plain string
  }
}



// === Get contract instance === This connects your Node.js app to the Hyperledger Fabric blockchain, gets access to a specific network channel and returns a reference to the smart contract (chaincode) so you can invoke or query it
async function getContract() {
  const ccp = yaml.load(fs.readFileSync(ccpPath, "utf8"));            //fs.readFileSync(...): reads the YAML file.  yaml.load(...): converts YAML to a JavaScript object.
  const wallet = await Wallets.newFileSystemWallet("wallet");         //Loads the identity wallet(id of appUser- digitalcert and pvt keys) stored on the file system.

  const gateway = new Gateway();                                       //Acts as the bridge between your app and the blockchain.  
  await gateway.connect(ccp, {                                         
    wallet,
    identity: "appUser",
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork("mychannel");
  return network.getContract("LoanContract");
}

// === API = Endpoints/Routes ===

// Init Ledger //When someone sends an HTTP POST request to http://localhost:3000/initLedger → run this function.
app.post("/initLedger", async (req, res) => {  //REST API endpoint
  try {
    const contract = await getContract();
    await contract.submitTransaction("initLedger");
    res.json({ message: "Ledger initialized successfully" }); //response in json
  } catch (error) {
    res.status(500).json({ error: error.message }); //the human-readable error text (e.g. "Contract not found").
  }
});

// Register Loan
app.post("/registerLoan", async (req, res) => {   //ROUTE HANDLER=It handles HTTP POST requests to the URL ROUTE /registerLoan.It defines what should happen when that endpoint is called.
  try {
    const { id, amount, borrower, lender, rate } = req.body; //Reads input fields from req.body (JSON sent by frontend).
    const contract = await getContract();
    const result = await contract.submitTransaction(
      "registerLoan",
      id,
      amount,                          //values of these are taken from: const { id, amount, borrower, lender, rate }
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
app.put("/createLoanAgreement/:id", async (req, res) => {
  try {
    const { id } = req.params;                     

//| Code                         | what it does?
//| ---------------------------- | -------------------------------------------------- |
//| `const id = req.params;`     | `id` is the **whole object** → `{ id: "LOAN123" }` |
//| `const { id } = req.params;` | `id` is the **actual value** → `"LOAN123"` ✅     |

    const contract = await getContract();
    const result = await contract.submitTransaction("createLoanAgreement", id);
    res.json(safeResponse(result, "Loan agreement created successfully"));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Loan Amount
app.put("/updateLoanAmount/:id", async (req, res) => { //:id :- A placeholder for a dynamic value
  try {
    const { id } = req.params; // ${id} in the URL → this is a path parameter.Example: /updateLoanAmount/LOAN123 → req.params.id = "LOAN123".
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
    res.json(JSON.parse(result.toString())); // Returns parsed JSON directly
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {                                           //or app.listen(PORT,function(){console.log("");});
  console.log(`🚀 Server running at http://localhost:${PORT}`); 
});
