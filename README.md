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

Full flow:
---

1.Browser → makes a POST with JSON body (payload).

const API = "http://localhost:3000";  // server base URL

await callAPI(`${API}/registerLoan`, { method: "POST", ... });

${API}/registerLoan → full URL: http://localhost:3000/registerLoan

This calls the server at that endpoint. The server runs the Express route handler, which is the API logic.

2.Server (Express) → receives JSON, extracts values. app.post("/registerLoan", ...) = a RESTful endpoint for creating a loan.

The full REST API = all the endpoints together (register, get, updateAmount, updateRate).

API = the URL you call.

REST = the style/conventions your API uses (HTTP verbs, endpoints, JSON responses).REST API is the “rules” or “endpoints” that allow other programs to talk to the server.

Together: your frontend calls a RESTful API at http://localhost:3000 which in turn talks to Fabric.



3.Server → calls Fabric smart contract method (registerLoan).

4.Server → sends back JSON success/error.

5.Browser → displays response in pre id="registerResult".


🔑 Key insight


Server: the program running at localhost:3000

API: the routes/endpoints that the server exposes (/registerLoan, /loan/:id, etc.)

URL: how the frontend finds the API (http://localhost:3000/registerLoan)

Server ≠ API, but the server hosts the API.

API ≠ URL, but the URL is how you access the API.

So when you call fetch(${API}/registerLoan), you’re using the API that your server exposes.

---

## 📚 License

This project is open-sourced under the MIT License.

---

## 👤 Author

GitHub: [Priya-Sharma-dotcom](https://github.com/Priya-Sharma-dotcom)

