<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Loan Management DApp</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #2c3e50; }
    button { margin: 5px; padding: 5px 10px; }
    input { margin: 5px; padding: 5px; }
    table { border-collapse: collapse; margin-top: 20px; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; }
    th { background-color: #f4f4f4; }
    .log { margin-top: 20px; padding: 10px; border: 1px solid #ccc; max-height: 200px; overflow-y: auto; }
    .success { color: green; }
    .error { color: red; }
  </style>
</head>
<body>
  <h1>Loan Management DApp (Node.js Backend)</h1>

  <button id="initLedgerBtn">Initialize Ledger</button>

  <h2>Register Loan</h2>
  <input id="loanId" placeholder="Loan ID" />
  <input id="loanAmount" placeholder="Amount" />
  <input id="borrower" placeholder="Borrower" />
  <input id="lender" placeholder="Lender" />
  <input id="interestRate" placeholder="Interest Rate" />
  <button id="registerLoanBtn">Register</button>

  <h2>Update Loan</h2>
  <input id="updateId" placeholder="Loan ID" />
  <input id="updateAmount" placeholder="New Amount" />
  <button id="updateAmountBtn">Update Amount</button>
  <input id="updateInterest" placeholder="New Interest Rate" />
  <button id="updateInterestBtn">Update Interest</button>

  <h2>Approve / Reject Loan</h2>
  <input id="actionId" placeholder="Loan ID" />
  <button id="approveLoanBtn">Approve</button>
  <button id="rejectLoanBtn">Reject</button>

  <h2>All Loans</h2>
  <table id="loansTable"></table>

  <div class="log" id="log"></div>

  <script>
    const API_BASE = "http://localhost:3000/api"; // adjust if deployed elsewhere

    // Utility for logging
    function addLog(message, type = "info") {
      const logDiv = document.getElementById("log");
      const p = document.createElement("p");
      p.textContent = message;
      p.className = type;
      logDiv.appendChild(p);
      logDiv.scrollTop = logDiv.scrollHeight;
    }

    async function handleAction(fn, args = []) {
      try {
        const result = await fn(...args);
        addLog(result, "success");
      } catch (err) {
        addLog(err.message, "error");
      }
    }

    // === Backend API calls ===
    async function initLedger() {
      const res = await fetch(`${API_BASE}/initLedger`, { method: "POST" });
      const data = await res.json();
      return data.message;
    }

    async function getAllLoans() {
      const res = await fetch(`${API_BASE}/getAllLoans`);
      return await res.json();
    }

    async function registerLoan(id, amount, borrower, lender, interestRate) {
      const res = await fetch(`${API_BASE}/registerLoan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, amount, borrower, lender, interestRate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data.message;
    }

    async function updateLoanAmount(id, amount) {
      const res = await fetch(`${API_BASE}/updateLoanAmount/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data.message;
    }

    async function updateLoanInterestRate(id, interestRate) {
      const res = await fetch(`${API_BASE}/updateLoanInterest/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interestRate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data.message;
    }

    async function approveLoan(id) {
      const res = await fetch(`${API_BASE}/approveLoan/${id}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data.message;
    }

    async function rejectLoan(id) {
      const res = await fetch(`${API_BASE}/rejectLoan/${id}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data.message;
    }

    // === Hook up UI buttons ===
    document.getElementById("initLedgerBtn").addEventListener("click", () =>
      handleAction(initLedger)
    );

    document.getElementById("registerLoanBtn").addEventListener("click", () => {
      const id = document.getElementById("loanId").value;
      const amount = document.getElementById("loanAmount").value;
      const borrower = document.getElementById("borrower").value;
      const lender = document.getElementById("lender").value;
      const rate = document.getElementById("interestRate").value;
      handleAction(registerLoan, [id, amount, borrower, lender, rate]);
    });

    document.getElementById("updateAmountBtn").addEventListener("click", () => {
      const id = document.getElementById("updateId").value;
      const amount = document.getElementById("updateAmount").value;
      handleAction(updateLoanAmount, [id, amount]);
    });

    document.getElementById("updateInterestBtn").addEventListener("click", () => {
      const id = document.getElementById("updateId").value;
      const rate = document.getElementById("updateInterest").value;
      handleAction(updateLoanInterestRate, [id, rate]);
    });

    document.getElementById("approveLoanBtn").addEventListener("click", () => {
      const id = document.getElementById("actionId").value;
      handleAction(approveLoan, [id]);
    });

    document.getElementById("rejectLoanBtn").addEventListener("click", () => {
      const id = document.getElementById("actionId").value;
      handleAction(rejectLoan, [id]);
    });

    // Render loans table
    async function renderLoans() {
      try {
        const loans = await getAllLoans();
        const table = document.getElementById("loansTable");
        table.innerHTML =
          "<tr><th>ID</th><th>Borrower</th><th>Lender</th><th>Amount</th><th>Rate</th><th>Status</th></tr>";
        loans.forEach((loan) => {
          table.innerHTML += `<tr>
            <td>${loan.id}</td>
            <td>${loan.borrower}</td>
            <td>${loan.lender}</td>
            <td>${loan.amount}</td>
            <td>${loan.interestRate}</td>
            <td>${loan.status}</td>
          </tr>`;
        });
      } catch (err) {
        addLog(err.message, "error");
      }
    }

    setInterval(renderLoans, 2000);
  </script>
</body>
</html>
