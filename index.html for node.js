<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Loan Management DApp</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"> //security handshake = trust + encryption setup before real data flows.
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600&family=Roboto:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #1a202c;
      --card-bg: #2d3748;
      --primary-accent: #4299e1;
      --primary-accent-hover: #63b3ed;
      --text-primary: #f7fafc;
      --text-secondary: #a0aec0;
      --border-color: #4a5568;
      --pre-bg: #1a202c;
      --pre-text: #90cdf4;
    }

    body {
      font-family: 'Roboto', sans-serif;
      margin: 0;
      padding: 40px 20px;
      background-color: var(--bg-dark);
      background-image: linear-gradient(180deg, var(--bg-dark) 0%, #1c2738 100%);
      color: var(--text-primary);
      min-height: 100vh;
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .container {
        max-width: 800px;
        margin: 0 auto;
    }

    h1, h2 {
      font-family: 'Poppins', sans-serif;
    }

    h1 {
      font-size: 2.5rem;
      text-align: center;
      color: var(--text-primary);
      margin-bottom: 60px;
      text-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }

    h2 {
      color: var(--primary-accent-hover);
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 10px;
      margin-top: 0;
      margin-bottom: 25px;
    }

    .section {
      background: var(--card-bg);
      margin-bottom: 30px;
      padding: 25px 30px;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid var(--border-color);
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }

    .section:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: var(--text-secondary);
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 12px;
      margin-bottom: 15px;
      border-radius: 6px;
      border: 1px solid var(--border-color);
      background: var(--bg-dark);
      color: var(--text-primary);
      box-sizing: border-box;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    input:focus {
      outline: none;
      border-color: var(--primary-accent);
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
    }

    button {
      display: block;
      width: 100%;
      padding: 12px;
      margin-top: 15px;
      border-radius: 6px;
      border: none;
      background: var(--primary-accent);
      color: white;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: background-color 0.2s ease-in-out, transform 0.1s ease;
    }

    button:hover {
      background: var(--primary-accent-hover);
    }

    button:active {
        transform: scale(0.98);
    }

    pre {
      background: var(--pre-bg);
      padding: 15px;
      border-radius: 8px;
      color: var(--pre-text);
      white-space: pre-wrap;
      word-wrap: break-word;
      margin-top: 20px;
      border: 1px solid var(--border-color);
      font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Loan Management System (Hyperledger Fabric)</h1>

    <div class="section">
      <h2>Init Ledger</h2>
      <button onclick="initLedger()">Initialize</button>
      <pre id="initResult"></pre>
    </div>

    <div class="section">
      <h2>Register Loan</h2>
      <label for="loanId">Loan ID:</label>
      <input id="loanId" />
      <label for="amount">Amount:</label>
      <input id="amount" />
      <label for="borrower">Borrower:</label>
      <input id="borrower" />
      <label for="lender">Lender:</label>
      <input id="lender" />
      <label for="rate">Interest Rate:</label>
      <input id="rate" />
      <button onclick="registerLoan()">Register</button>
      <pre id="registerResult"></pre>
    </div>

    <div class="section">
      <h2>Create Loan Agreement</h2>
      <label for="agreementId">Loan ID:</label>
      <input id="agreementId" />
      <button onclick="createLoanAgreement()">Create Agreement</button>
      <pre id="agreementResult"></pre>
    </div>

    <div class="section">
      <h2>Update Loan Amount</h2>
      <label for="updateAmountId">Loan ID:</label>
      <input id="updateAmountId" />
      <label for="newAmount">New Amount:</label>
      <input id="newAmount" />
      <button onclick="updateLoanAmount()">Update</button>
      <pre id="updateAmountResult"></pre>
    </div>

    <div class="section">
      <h2>Update Loan Interest Rate</h2>
      <label for="updateRateId">Loan ID:</label>
      <input id="updateRateId" />
      <label for="newRate">New Rate:</label>
      <input id="newRate" />
      <button onclick="updateLoanRate()">Update</button>
      <pre id="updateRateResult"></pre>
    </div>

    <div class="section">
      <h2>Get Loan By ID</h2>
      <label for="getLoanId">Loan ID:</label>
      <input id="getLoanId" />
      <button onclick="getLoan()">Fetch Loan</button>
      <pre id="loanResult"></pre>
    </div>
  </div>

  <script>
  const API = "http://localhost:3000";

  async function callAPI(url, options, outputId) {
    const outputElement = document.getElementById(outputId);
    outputElement.textContent = 'Loading...';
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'An error occurred');
      }
      outputElement.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      outputElement.textContent = `Error: ${err.message}`;
    }
  }

  async function initLedger() {
    await callAPI(`${API}/initLedger`, { method: "POST" }, "initResult");
  }

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }, "registerResult");
  }

  async function createLoanAgreement() {
    const payload = { id: document.getElementById("agreementId").value };
    await callAPI(`${API}/createLoanAgreement`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }, "agreementResult");
  }

  async function updateLoanAmount() {
    const id = document.getElementById("updateAmountId").value;
    const payload = { newAmount: document.getElementById("newAmount").value };
    await callAPI(`${API}/updateLoanAmount/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }, "updateAmountResult");
  }

  async function updateLoanRate() {
    const id = document.getElementById("updateRateId").value;
    const payload = { newRate: document.getElementById("newRate").value };
    await callAPI(`${API}/updateLoanRate/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }, "updateRateResult");
  }

  async function getLoan() {
    const id = document.getElementById("getLoanId").value;
    await callAPI(`${API}/loan/${id}`, {}, "loanResult");
  }
</script>
  </body>
</html>
