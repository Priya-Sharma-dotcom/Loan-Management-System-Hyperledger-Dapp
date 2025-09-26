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

// ===== Logging Libraries =====
const morgan = require("morgan"); //automatic HTTP logs (for requests)- middleware
const winston = require("winston"); //Winston is a general-purpose logging library.


// Winston logger setup
const logger = winston.createLogger({
  level: "info",                                           //minimum severity of logs to record
  format: winston.format.json(),
  transports: [                                           //output destination
    new winston.transports.Console(),  // logs to console
    new winston.transports.File({ filename: "error.log", level: "error" }), // error logs
    new winston.transports.File({ filename: "combined.log" }) // all logs(error+warn+info level logs)
  ],
});


const app = express();                   //creates express application= instance of express web server
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(morgan("combined"));          //// Use Morgan for HTTP request logging, combined=predefined format string that tells Morgan what information to log for each HTTP request.Logs HTTP Req on Console


// Connection profile path  =====Common Connection Profile, which contains:Peer addresses,CA info,TLS options,Org configs✅ This profile tells your app how to connect to the Fabric network=====
const ccpPath = "/home/labuser/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.yaml";
const walletPath = "/home/labuser/eclipse-workspace/LoanManagementClient/wallet";

// === Helper to wrap chaincode responses safely ===
function safeResponse(result, successMsg) {
  if (!result || result.length === 0) {     //== → "Are the values equal after type conversion?"   === → "Are the values equal and of the same type?"
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
  const wallet = await Wallets.newFileSystemWallet(walletPath);         //Loads the identity wallet(id of appUser- digitalcert and pvt keys) stored on the file system.

  const identity = await wallet.get("appUser");
  if (!identity) {
     logger.error("appUser identity not found in wallet");
    throw new Error("appUser identity not found in wallet");
  }

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


// Health check endpoint //•	Useful for monitoring tools (Kubernetes, Docker, AWS load balancers) to know if your app is alive.
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),               //in seconds
    timestamp: new Date().toISOString(),    //currentTime
  });
});

// Init Ledger //When someone sends an HTTP POST request to http://localhost:3000/initLedger → run this function.
app.post("/initLedger", async (req, res, next) => {                               //REST API endpoint
  try {
    const contract = await getContract();
    await contract.submitTransaction("initLedger");
    res.json({ message: "Ledger initialized successfully" });                   //response in json
  } catch (error) {
    logger.error("initLedger failed", { error: error.message });                //Morgan calls next() → passes control to the next middleware or route handler.      
    next(error);                                                                //control given to Error Middleware //next() is a Express function used to Pass control to the next middleware in the chain.

  }
});

// Register Loan
app.post("/registerLoan", async (req, res, next) => {   //ROUTE HANDLER=It handles HTTP POST requests to the URL ROUTE /registerLoan.It defines what should happen when that endpoint is called.
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
     logger.error("registerLoan failed", { error: error.message });
    next(error);
    //res.status(500).json({ error: error.message });              //2xx → Success responses, 4xx → Client-side errors, 5xx → Server-side errors
  }
});

// Create Loan Agreement
app.put("/createLoanAgreement/:id", async (req, res, next) => {
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
     logger.error("createLoanAgreement failed", { error: error.message });
    next(error);
  }
});

// Update Loan Amount
app.put("/updateLoanAmount/:id", async (req, res, next) => { //:id :- A placeholder for a dynamic value
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
    logger.error("updateLoanAmount failed", { error: error.message });
    next(error);
  }
});

// Update Loan Interest Rate
app.put("/updateLoanRate/:id", async (req, res, next) => {
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
   logger.error("updateLoanRate failed", { error: error.message });
    next(error);
  }
});

// Get Loan By ID
app.get("/loan/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const contract = await getContract();
    const result = await contract.evaluateTransaction("getLoanById", id);
    res.json(JSON.parse(result.toString())); // Returns parsed JSON directly
  } catch (error) {
    logger.error("getLoanById failed", { error: error.message });
    next(error);
  }
});

// === Error Handling Middleware === // 	It logs the error with Winston (logger.error).It sends a JSON error response to the client:
// {"error": "Something went wrong!",
//  "details": "appUser identity not found in wallet"}

//	This ensures you don’t crash the server and always send a clear error.
//Placed after all routes so that next(error) works

app.use((err, req, res, next) => {
  logger.error("Unhandled error", { error: err.message });
  res.status(500).json({ error: "Something went wrong!", details: err.message });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {                                           //or app.listen(PORT,function(){console.log("");});
  logger.info(`🚀 Server running at http://localhost:${PORT}`); 
});
