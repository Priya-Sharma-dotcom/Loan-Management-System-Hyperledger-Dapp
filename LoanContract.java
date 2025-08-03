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
    name = "Loan Contract",
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

    @Transaction
    public void initLedger(final Context ctx) {
        ChaincodeStub stub = ctx.getStub();
        Loan loan = new Loan("L001", "10000", "Priya", "Axis", "6.5", "Agreed");
        stub.putStringState("L001", genson.serialize(loan));
    }

    @Transaction
    public Loan registerLoan(final Context ctx, final String id, final String amt, final String borr, final String lend, final String rate) {
        ChaincodeStub stub = ctx.getStub();

        if (!stub.getStringState(id).isEmpty()) {
            String errMsg = String.format("loan already exists at id %s ", id);
            System.out.println(errMsg);
            throw new ChaincodeException(errMsg, Loan_ERRORS.LoanAlreadyExists.name());
        }

        Loan loan = new Loan(id, amt, borr, lend, rate, "draft");
        stub.putStringState(id, genson.serialize(loan));
        return loan;
    }

    @Transaction
    public Loan createLoanAgreement(final Context ctx, final String id) {
        ChaincodeStub stub = ctx.getStub();

        if (stub.getStringState(id).isEmpty()) {
            String errMsg = String.format("loan is not registered and drafted at id %s", id);
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

        if (stub.getStringState(id).isEmpty()) {
            String errMsg = String.format("loan is not registered at id %s", id);
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

        if (stub.getStringState(id).isEmpty()) {
            String errMsg = String.format("loan not registered at id %s", id);
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
            String errMsg = String.format("loan not registered at id %s", id);
            System.out.println(errMsg);
            throw new ChaincodeException(errMsg, Loan_ERRORS.LoanNotRegistered.toString());
        }

        Loan loan = genson.deserialize(stub.getStringState(id), Loan.class);
        return loan;
    }
}
