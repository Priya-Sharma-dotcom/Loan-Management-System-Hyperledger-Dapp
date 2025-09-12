<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Loan Management DApp</title>
  <style>
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
      white-space: pre-wrap;
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

  <div class="section">
    <h2>Init Ledger</h2>
    <button onclick="initLedger()">Initialize</button>
    <pre id="initResult"></pre>
  </div>

  <div class="section">
    <h2>Register Loan</h2>
    <label>Loan ID: <input id="loanId" /></label>
    <label>Amount: <input id="amount" /></label>
    <label>Borrower: <input id="borrower" /></label>
    <label>Lender: <input id="lender" /></label>
    <label>Interest Rate: <input id="rate" /></label>
    <button onclick="registerLoan()">Register</button>
    <pre id="registerResult"></pre>
  </div>

  <div class="section">
    <h2>Create Loan Agreement</h2>
    <label>Loan ID: <input id="agreementId" /></label>
    <button onclick="createLoanAgreement()">Create Agreement</button>
    <pre id="agreementResult"></pre>
  </div>

  <div class="section">
    <h2>Update Loan Amount</h2>
    <label>Loan ID: <input id="updateAmountId" /></label>
    <label>New Amount: <input id="newAmount" /></label>
    <button onclick="updateLoanAmount()">Update</button>
    <pre id="updateAmountResult"></pre>
  </div>

  <div class="section">
    <h2>Update Loan Interest Rate</h2>
    <label>Loan ID: <input id="updateRateId" /></label>
    <label>New Rate: <input id="newRate" /></label>
    <button onclick="updateLoanRate()">Update</button>
    <pre id="updateRateResult"></pre>
  </div>

  <div class="section">
    <h2>Get Loan By ID</h2>
    <label>Loan ID: <input id="getLoanId" /></label>
    <button onclick="getLoan()">Fetch Loan</button>
    <pre id="loanResult"></pre>
  </div>

  <script>
    const API = "http://localhost:3000";

    async function initLedger() {
      try {
        const res = await fetch(`${API}/initLedger`, { method: "POST" });
        document.getElementById("initResult").textContent = await res.text();
      } catch (err) {
        document.getElementById("initResult").textContent = err;
      }
    }

    async function registerLoan() {
      const payload = {
        id: document.getElementById("loanId").value,
        amount: document.getElementById("amount").value,
        borrower: document.getElementById("borrower").value,
        lender: document.getElementById("lender").value,
        rate: document.getElementById("rate").value,
      };
      try {
        const res = await fetch(`${API}/registerLoan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        document.getElementById("registerResult").textContent = await res.text();
      } catch (err) {
        document.getElementById("registerResult").textContent = err;
      }
    }

    async function createLoanAgreement() {
      const payload = { id: document.getElementById("agreementId").value };
      try {
        const res = await fetch(`${API}/createLoanAgreement`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        document.getElementById("agreementResult").textContent = await res.text();
      } catch (err) {
        document.getElementById("agreementResult").textContent = err;
      }
    }

    async function updateLoanAmount() {
      const id = document.getElementById("updateAmountId").value;
      const payload = { newAmount: document.getElementById("newAmount").value };
      try {
        const res = await fetch(`${API}/updateLoanAmount/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        document.getElementById("updateAmountResult").textContent = await res.text();
      } catch (err) {
        document.getElementById("updateAmountResult").textContent = err;
      }
    }

    async function updateLoanRate() {
      const id = document.getElementById("updateRateId").value;
      const payload = { newRate: document.getElementById("newRate").value };
      try {
        const res = await fetch(`${API}/updateLoanRate/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        document.getElementById("updateRateResult").textContent = await res.text();
      } catch (err) {
        document.getElementById("updateRateResult").textContent = err;
      }
    }

    async function getLoan() {
      const id = document.getElementById("getLoanId").value;
      try {
        const res = await fetch(`${API}/loan/${id}`);
        document.getElementById("loanResult").textContent = await res.text();
      } catch (err) {
        document.getElementById("loanResult").textContent = err;
      }
    }
  </script>
</body>
</html>
