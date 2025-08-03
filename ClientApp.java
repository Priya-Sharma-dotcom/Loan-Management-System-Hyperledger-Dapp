package fabricJavaClient;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.hyperledger.fabric.gateway.Contract;
import org.hyperledger.fabric.gateway.Gateway;
import org.hyperledger.fabric.gateway.Network;
import org.hyperledger.fabric.gateway.Wallet;
import org.hyperledger.fabric.gateway.Wallets;

public class clientapp {

    static {
        System.setProperty("org.hyperledger.fabric.sdk.service_discovery.as_localhost", "true");
    }

    public static void main(String[] args) throws Exception {

        // Load wallet from file system
        Wallet wallet = Wallets.newFileSystemWallet(Paths.get("wallet"));

        // Load connection profile
        Path config = Paths.get("..", "..", "fabric-samples", "test-network", "organizations",
                "peerOrganizations", "org1.example.com", "connection-org1.yaml");

        // Build a gateway connection
        Gateway.Builder builder = Gateway.createBuilder();
        builder.identity(wallet, "appUser").networkConfig(config).discovery(true);

        try (Gateway gateway = builder.connect()) {

            // Get the network channel
            Network network = gateway.getNetwork("mychannel");  // fixed typo from "mychanel"

            // Get the smart contract
            Contract contract = network.getContract("LoanContract");  // Contract name must match what's deployed

            // Call chaincode transactions
            contract.submitTransaction("initLedger");
            System.out.println("Ledger initialized successfully.");

            contract.submitTransaction("registerLoan", "L002", "15000", "Anjali", "HDFC", "7.2");
            System.out.println("Loan registered successfully.");

            contract.submitTransaction("createLoanAgreement", "L002");
            System.out.println("Loan agreement created successfully.");

            contract.submitTransaction("updateLoanAmount", "L002", "18000");
            System.out.println("Loan amount updated successfully.");

            byte[] result = contract.evaluateTransaction("getLoanById", "L002");
            String loanDetails = new String(result);
            System.out.println("Loan details: " + loanDetails);
        }
    }
}
