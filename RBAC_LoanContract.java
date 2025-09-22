// Setup for Client Identity:
//
// For this to work, you need to set up roles (borrower and lender) in the client certificates when users are enrolled on the network.
// You can do this by adding attributes to the client certificates during user registration. 
// For example, when enrolling users, you can add a role attribute like so:
// --attributes role=borrower
//
// This allows the Hyperledger Fabric client to retrieve the 'role' attribute during transactions 
// and enforce the correct access control based on that role.


package _LoanManagementSystem;

import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.contract.ContractInterface;
import org.hyperledger.fabric.contract.annotation.Contract;
import org.hyperledger.fabric.contract.annotation.Default;
import org.hyperledger.fabric.contract.annotation.Info;
import org.hyperledger.fabric.contract.annotation.Transaction;
import org.hyperledger.fabric.shim.ChaincodeException;
import org.hyperledger.fabric.shim.ChaincodeStub;
import com.owlike.genson.Genson;

@Contract(
    name = "LoanContract",
    info = @Info(
        title = "Loan Contract using Hyperledger",
        description = "Chaincode for Loan Management System",
        version = "0.0.1-SNAPSHOT"
    )
)
@Default
public class LoanContract implements ContractInterface {

    private final Genson genson = new Genson();

    private enum Loan_ERRORS { LoanNotRegistered, LoanAlreadyExists }

    private enum Role_ERRORS { Unauthorized, InvalidRole }

    // Helper method to get the client's role from their certificate attributes
   private String getClientRole(Context ctx) {
    try {
        String role = ctx.getClientIdentity().getAttributeValue("role");
        if (!"borrower".equals(role) && !"lender".equals(role)) {
            throw new ChaincodeException("Invalid role in certificate", Role_ERRORS.InvalidRole.name());
        }
        return role;
    } catch (Exception e) {
        throw new ChaincodeException("Error retrieving client role: " + e.getMessage(),Role_ERRORS.InvalidRole.name());
    }
}


    @Transaction
    public void initLedger(final Context ctx) {
        // Restrict the initLedger function to be callable only by the borrower
        String clientRole = getClientRole(ctx);
        if (clientRole == null || !clientRole.equals("borrower")) {
            String errMsg = "Only the borrower can initialize the ledger.";
            System.out.println(errMsg);
            throw new ChaincodeException(errMsg, Role_ERRORS.Unauthorized.name());
        }

        ChaincodeStub stub = ctx.getStub();
        Loan loan = new Loan("L001", "10000", "Priya", "Axis", "6.5", "Agreed");
        stub.putStringState("L001", genson.serialize(loan));
    }

    @Transaction
    public Loan registerLoan(final Context ctx, final String id, final String amt, final String borr, final String lend, final String rate) {
        ChaincodeStub stub = ctx.getStub();

        // Check if the loan already exists
        if (!stub.getStringState(id).isEmpty()) {
            String errMsg = String.format("Loan already exists at id %s ", id);
            System.out.println(errMsg);
            throw new ChaincodeException(errMsg, Loan_ERRORS.LoanAlreadyExists.name());
        }

        // Only the borrower can register a loan
        String clientRole = getClientRole(ctx);
        if (clientRole == null || !clientRole.equals("borrower")) {
            String errMsg = "Only the borrower can register a loan.";
            System.out.println(errMsg);
            throw new ChaincodeException(errMsg, Role_ERRORS.Unauthorized.name());
        }

        Loan loan = new Loan(id, amt, borr, lend, rate, "draft");
        stub.putStringState(id, genson.serialize(loan));
        return loan;
    }

    @Transaction
    public Loan createLoanAgreement(final Context ctx, final String id) {
        ChaincodeStub stub = ctx.getStub();

        // Only the lender can create the loan agreement (finalize the loan)
        String clientRole = getClientRole(ctx);
        if (clientRole == null || !clientRole.equals("lender")) {
            String errMsg = "Only the lender can create a loan agreement.";
            System.out.println(errMsg);
            throw new ChaincodeException(errMsg, Role_ERRORS.Unauthorized.name());
        }

        if (stub.getStringState(id).isEmpty()) {
            String errMsg = String.format("Loan is not registered and drafted at id %s", id);
            System.out.println(errMsg);
            throw new ChaincodeException(errMsg, Loan_ERRORS.LoanNotRegistered.toString());
        }

        Loan registeredLoan = genson.deserialize(stub.getStringState(id), Loan.class);
        Loan approvedLoan = new Loan(
            registeredLoan.getId(),
            registeredLoan.getAmount(),
            registeredLoan.getBorrower(),
            registeredLoan.getLender(),
            registeredLoan.getInterestRate(),
            "Agreed"
        );

        stub.putStringState(id, genson.serialize(approvedLoan));
        return approvedLoan;
    }

    @Transaction
    public Loan updateLoanAmount(final Context ctx, final String id, final String newAmount) {
        ChaincodeStub stub = ctx.getStub();

        // Only the lender can update the loan amount
        String clientRole = getClientRole(ctx);
        if (clientRole == null || !clientRole.equals("lender")) {
            String errMsg = "Only the lender can update the loan amount.";
            System.out.println(errMsg);
            throw new ChaincodeException(errMsg, Role_ERRORS.Unauthorized.name());
        }

        if (stub.getStringState(id).isEmpty()) {
            String errMsg = String.format("Loan is not registered at id %s", id);
            System.out.println(errMsg);
            throw new ChaincodeException(errMsg, Loan_ERRORS.LoanNotRegistered.name());
        }

        Loan existing = genson.deserialize(stub.getStringState(id), Loan.class);

        Loan updated = new Loan(
            existing.getId(),
            newAmount,
            existing.getBorrower(),
            existing.getLender(),
            existing.getInterestRate(),
            String.format("Loan Amount Updated from %s to %s ", newAmount, existing.getAmount())
        );

        stub.putStringState(id, genson.serialize(updated));
        return updated;
    }

    @Transaction
    public Loan updateLoanInterestRate(final Context ctx, final String id, final String newRate) {
        ChaincodeStub stub = ctx.getStub();

        // Only the lender can update the interest rate
        String clientRole = getClientRole(ctx);
        if (clientRole == null || !clientRole.equals("lender")) {
            String errMsg = "Only the lender can update the interest rate.";
            System.out.println(errMsg);
            throw new ChaincodeException(errMsg, Role_ERRORS.Unauthorized.name());
        }

        if (stub.getStringState(id).isEmpty()) {
            String errMsg = String.format("Loan not registered at id %s", id);
            System.out.println(errMsg);
            throw new ChaincodeException(errMsg, Loan_ERRORS.LoanNotRegistered.toString());
        }

        Loan existing = genson.deserialize(stub.getStringState(id), Loan.class);

        Loan updated = new Loan(
            existing.getId(),
            existing.getAmount(),
            existing.getBorrower(),
            existing.getLender(),
            newRate,
            String.format("Interest Rate Updated from %s to %s ", newRate, existing.getInterestRate())
        );

        stub.putStringState(id, genson.serialize(updated));
        return updated;
    }

    @Transaction
    public Loan getLoanById(final Context ctx, final String id) {
        ChaincodeStub stub = ctx.getStub();

        if (stub.getStringState(id).isEmpty()) {
            String errMsg = String.format("Loan not registered at id %s", id);
            System.out.println(errMsg);
            throw new ChaincodeException(errMsg, Loan_ERRORS.LoanNotRegistered.toString());
        }

        Loan loan = genson.deserialize(stub.getStringState(id), Loan.class);
        return loan;
    }
}
