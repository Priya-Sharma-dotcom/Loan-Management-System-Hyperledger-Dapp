package _LoanManagementSystem;

import java.util.Objects;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;

import com.owlike.genson.annotation.JsonProperty;

@DataType
public class Loan {

	@Property
	private final String loanId;
	
	@Property
	private final String amount;
	
	@Property
	private final String borrower;
	
	@Property
	private final String lender;
	
	@Property
	private final String interestRate;
	
	@Property
	private final String status;
	
	
	public String getId() {
		return loanId;
	}
	
	public String getAmount() {
		return amount;
	}
	
	public String getBorrower() {
		return borrower;
	}
	
	public String getLender() {
		return lender;
	}
	
	public String getInterestRate() {
		return interestRate;
	}
	public String getStatus() {
		return status;
	}
	
	public Loan(@JsonProperty("loanId") final String id,@JsonProperty("amount")final String amt,
			@JsonProperty("borrower")final String borr, @JsonProperty("lender")final String lend,
			@JsonProperty("interestRate")final String interest,@JsonProperty("status") final String stat) {
		this.loanId=id;
		this.amount=amt;
		this.borrower=borr;
		this.lender=lend;
		this.interestRate=interest;
		this.status=stat;
	}
	
	
	@Override
	public boolean equals(final Object obj) {
		if(this==obj) return true;
		if(obj ==null || getClass()!=obj.getClass()) {
			return false;
		}
		
		Loan other=(Loan)obj;
		return Objects.deepEquals(
		new String[] {loanId,amount,borrower,lender,interestRate,status},
		new String [] {other.loanId,other.amount,other.borrower,other.lender,other.interestRate,other.status});
	}
	
	
	
	@Override
	public int hashCode() {
		return Objects.hash(loanId,amount,borrower,lender,interestRate,status);
	}
	
	
	@Override
	public String toString() {
		return "Loan@ "+Integer.toHexString(hashCode())+" loanId "+loanId+" amount "+amount+" borrower "+borrower +" lender "+lender+" interestRate "+interestRate+" status "+status;
	}
}
