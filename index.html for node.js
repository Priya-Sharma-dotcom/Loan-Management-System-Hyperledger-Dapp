<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Loan Management DApp</title>
  <style>
    /* ===== General page styling ===== */
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      background: #111;
      color: #eee;
    }
    h1, h2 {
      color: #4cafef;
    }
    label {
      display: block;
      margin-top: 10px;
    }
    input, button {
      padding: 8px;
      margin-top: 5px;
      border-radius: 4px;
      border: none;
    }
    button {
      background: #4cafef;
      color: white;
      cursor: pointer;
    }
    button:hover {
      background: #379bd1;
    }
    pre {
      background: #222;
      padding: 10px;
      border-radius: 6px;
      color: #4cafef;
      white-space: pre-wrap; /* keeps formatting of JSON output */
    }
    .section {
      margin-bottom: 30px;
      border-bottom: 1px solid #444;
      padding-bottom: 20px;
    }
  </style>
</head>
<body>
  <h1>Loan Management System (Hyperledger Fabric)</h1>

  <!-- === Section: Initialize Ledger === -->
  <div class="section">
    <h2>Init Ledger</h2>
    <button onclick="initLedger()">Initialize</button>
    <pre id="initResult"></pre> <!-- Output from server will appear here -->
  </div>

  <!-- === Section: Register Loan === -->
  <div class="section">
    <h2>Register Loan</h2>
    <label>Loan ID: <input id="loanId" /></label>
    <label>Amount: <input id="amount" /></label>
    <label>Borrower: <input id="borrower" /></label>
    <label>Lender: <input id="lender" /></label>
    <label>Interest Rate: <input id="rate" /></label>
    <button onclick="registerLoan()">Register</button>
    <pre id="registerResult"></pre> <!-- API response will appear here -->
  </div>

  <!-- === Section: Create Loan Agreement === -->
  <div class="section">
    <h2>Create Loan Agreement</h2>
    <label>Loan ID: <input id="agreementId" /></label>
    <button onclick="createLoanAgreement()">Create Agreement</button>
    <pre id="agreementResult"></pre>
  </div>

  <!-- === Section: Update Loan Amount === -->
  <div class="section">
    <h2>Update Loan Amount</h2>
    <label>Loan ID: <input id="updateAmountId" /></label>
    <label>New Amount: <input id="newAmount" /></label>
    <button onclick="updateLoanAmount()">Update</button>
    <pre id="updateAmountResult"></pre>
  </div>

  <!-- === Section: Update Loan Interest Rate === -->
  <div class="section">
    <h2>Update Loan Interest Rate</h2>
    <label>Loan ID: <input id="updateRateId" /></label>
    <label>New Rate: <input id="newRate" /></label>
    <button onclick="updateLoanRate()">Update</button>
    <pre id="updateRateResult"></pre>
  </div>

  <!-- === Section: Get Loan By ID === -->
  <div class="section">
    <h2>Get Loan By ID</h2>
    <label>Loan ID: <input id="getLoanId" /></label>
    <button onclick="getLoan()">Fetch Loan</button>
    <pre id="loanResult"></pre>
  </div>

  <script>
  // === Base API URL (server address) ===
  const API = "http://localhost:3000";

  /**
   * Generic function to call backend APIs
   * - url: endpoint to call (string)
   * - options: HTTP method, headers, body, etc. (object)
   * - outputId: id of <pre> element where result will be displayed
   */
  async function callAPI(url, options, outputId) {
    try {
      // Make HTTP request using fetch (returns a Promise)
      const res = await fetch(url, options);

      // Parse response as JSON
      const data = await res.json();

      // Display formatted JSON string in the target <pre> block
      document.getElementById(outputId).textContent =
        JSON.stringify(data, null, 2);
    } catch (err) {
      // If error occurs, show error message in target <pre>
      document.getElementById(outputId).textContent = err;
    }
  }

  /** === API Calls (frontend triggers) === */

  // Initialize ledger- triggers route /initLedger in server.js
  async function initLedger() {
    await callAPI(`${API}/initLedger`, { method: "POST" }, "initResult");
  }

  // Register new loan
  async function registerLoan() {
    const payload = {
      id: document.getElementById("loanId").value,
      amount: document.getElementById("amount").value,
      borrower: document.getElementById("borrower").value,
      lender: document.getElementById("lender").value,
      rate: document.getElementById("rate").value,
    };

    await callAPI(`${API}/registerLoan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // tells server request body is JSON
      body: JSON.stringify(payload), // convert JS object → JSON string
    }, "registerResult");
  }

  // Create loan agreement
  async function createLoanAgreement() {
    const payload = { id: document.getElementById("agreementId").value };

    await callAPI(`${API}/createLoanAgreement`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }, "agreementResult");
  }

  // Update loan amount
  async function updateLoanAmount() {
    const id = document.getElementById("updateAmountId").value;
    const payload = { newAmount: document.getElementById("newAmount").value };

    await callAPI(`${API}/updateLoanAmount/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }, "updateAmountResult");
  }


  // Update loan interest rate//

  async function updateLoanRate() {
    const id = document.getElementById("updateRateId").value;
    const payload = { newRate: document.getElementById("newRate").value };

    await callAPI(`${API}/updateLoanRate/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }, "updateRateResult");
  }

  // Fetch loan details by ID

  async function getLoan() {
    const id = document.getElementById("getLoanId").value;

    await callAPI(`${API}/loan/${id}`, {}, "loanResult");
  }
  </script>
</body>
</html>
