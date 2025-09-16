# Loan-Management-System-Hyperledger-Fabric-SDK-Dapp

This project is a Java-based Loan Management System built using Hyperledger Fabric. It includes a smart contract (`LoanContract`) and a client application using the Fabric Java SDK to manage loan lifecycle operations on the blockchain.

---

## ⚖️ Features

* Initialize the ledger with a default loan
* Register a new loan with details
* Create a loan agreement (sets status to "Agreed")
* Update loan amount and status
* Query loan by ID

---

## 💡 Technologies Used

* Java 11+
* Hyperledger Fabric (test-network)
* Fabric Gateway SDK (Java)
* Gradle / Maven (both build systems provided)

---

## 📁 Project Structure

```
├── ClientApp.java                  # Main client app to run transactions
├── EnrollAdmin.java                # Enrolls Org1 admin to wallet
├── EnrollRegisterClientUser.java  # Registers and enrolls 'appUser'
├── LoanContract.java              # Smart contract (annotated with @Contract(name = "LoanContract"))
├── Loan.java                      # POJO model for Loan asset
├── build.gradle.kts / pom.xml     # Build files (choose Gradle or Maven)
├── README.md                      # Project documentation
└── wallet/                        # Stores user identities
```

---

## 🚀 Getting Started

### 1. Start the Fabric Test Network

```bash
cd fabric-samples/test-network
./network.sh up createChannel -c mychannel -ca
```

### 2. Deploy Chaincode

Install and instantiate the chaincode `LoanContract` on the `mychannel`. Use the contract name exactly as annotated:

```java
@Contract(name = "LoanContract")
```

### 3. Enroll Admin and App User

```bash
java EnrollAdmin
java EnrollRegisterClientUser
```

### 4. Run the Client App

```bash
java ClientApp
```

This executes:

* `initLedger`
* `registerLoan`
* `createLoanAgreement`
* `updateLoanAmount`
* `getLoanById`

---

## 🔍 Example Transactions

```java
contract.submitTransaction("registerLoan", "L002", "15000", "Anjali", "HDFC", "7.2");
contract.submitTransaction("createLoanAgreement", "L002");
contract.submitTransaction("updateLoanAmount", "L002", "18000");
byte[] result = contract.evaluateTransaction("getLoanById", "L002");
System.out.println(new String(result));
```



---

## Full Flow

1. **Browser → makes a POST with JSON body (payload)**

```javascript
const API = "http://localhost:3000"; // server base URL

await callAPI(`${API}/registerLoan`, { method: "POST", ... });
```

* `${API}/registerLoan` → full URL: `http://localhost:3000/registerLoan`
* This calls the server at that endpoint. The server runs the **Express route handler**, which is the API logic.

---

2. **Server (Express) → receives JSON, extracts values**

```javascript
app.post("/registerLoan", ...)  // RESTful endpoint for creating a loan
```

* The **full REST API** = all endpoints together (`register`, `get`, `updateAmount`, `updateRate`).
* **API** = the URL you call.
* **REST** = style/conventions your API uses (HTTP verbs, endpoints, JSON responses).
* REST API = the “rules” or “endpoints” that allow programs to talk to the server.
* Together: your frontend calls a RESTful API at `http://localhost:3000`, which in turn talks to Fabric.

---

3. **Server → calls Fabric smart contract method (`registerLoan`)**

---

4. **Server → sends back JSON success/error**

---

5. **Browser → displays response in `<pre id="registerResult">`**

---

### 🔑 Key Insight

* **Server**: the program running at `localhost:3000`
* **API**: the routes/endpoints that the server exposes (`/registerLoan`, `/loan/:id`, etc.)
* **URL**: how the frontend finds the API (`http://localhost:3000/registerLoan`)

**Important:**

* Server ≠ API, but the server **hosts the API**
* API ≠ URL, but the URL is **how you access the API**
* So when you call `fetch(${API}/registerLoan)`, you’re using the **API that your server exposes**

---
# Hyperledger Fabric Client vs Server

## 1. ClientApp.java (Java SDK)

- Uses the Fabric Java SDK (`org.hyperledger.fabric.gateway.*` classes).
- You run it as a standalone Java application (a console client).
- It connects directly to the Fabric network using a wallet + connection profile (`connection-org1.yaml`).
- You explicitly code transactions inside `main()` (e.g., `initLedger`, `registerLoan`, etc.).
- One-off execution: You run the program, it connects, sends transactions, prints results, exits.

**Think of it like:**  
“I’m a Java program, I’ll talk to Fabric once, do my job, and leave.”

---

## 2. server.js (Node.js SDK)

- Uses the Fabric Node.js SDK (`fabric-network` package).
- Instead of being a one-shot client, it sets up an Express.js web server.
- This server exposes REST APIs (`/initLedger`, `/registerLoan`, `/loan/:id`, etc.) so your frontend or external clients can call Fabric indirectly.
- Under the hood, it still:
  - Loads wallet and connection profile.
  - Connects to Gateway.
  - Gets contract from `LoanContract`.
  - Calls `submitTransaction` / `evaluateTransaction`.

**Think of it like:**  
“I’m a permanent service running on port 3000. Anyone (e.g., browser frontend) can send me an HTTP request, and I’ll translate it into a Fabric transaction.”

---

## 3. Key Difference

- **Java client** = direct blockchain app (user has to run it manually).  
- **Node server** = blockchain middleware (runs continuously, exposes REST endpoints).  

Both use Fabric SDK → just different SDKs (Java vs Node.js).



---

## 📚 License

This project is open-sourced under the MIT License.

---

## 👤 Author

GitHub: [Priya-Sharma-dotcom](https://github.com/Priya-Sharma-dotcom)

