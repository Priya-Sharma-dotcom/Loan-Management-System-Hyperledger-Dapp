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

Browser → makes a POST with JSON body (payload).

Server (Express) → receives JSON, extracts values.

Server → calls Fabric smart contract method (registerLoan).

Server → sends back JSON success/error.

Browser → displays response in <pre id="registerResult">.
---

## 📚 License

This project is open-sourced under the MIT License.

---

## 👤 Author

GitHub: [Priya-Sharma-dotcom](https://github.com/Priya-Sharma-dotcom)

