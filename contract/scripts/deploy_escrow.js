const { ethers } = require("hardhat");

async function main() {
  console.log("Starting TuitionEscrow deployment...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");
  
  // Configuration - UPDATE THESE VALUES FOR YOUR DEPLOYMENT
  const TUSDC_TOKEN_ADDRESS = "0xE848aDaDC71b7373639e4EbeC1E81331731F5Dad"; // Replace with actual tUSDC token address
  const INITIAL_ADMIN_ADDRESS = deployer.address; // Can be changed to a different admin address
  
 
  
  if (!ethers.isAddress(TUSDC_TOKEN_ADDRESS)) {
    throw new Error("Invalid tUSDC token address format");
  }
  
  if (!ethers.isAddress(INITIAL_ADMIN_ADDRESS)) {
    throw new Error("Invalid initial admin address format");
  }
  
  console.log("Configuration:");
  console.log("- tUSDC Token Address:", TUSDC_TOKEN_ADDRESS);
  console.log("- Initial Admin Address:", INITIAL_ADMIN_ADDRESS);
  
  // Get the contract factory
  const TuitionEscrow = await ethers.getContractFactory("TuitionEscrow");
  
  console.log("\nDeploying TuitionEscrow contract...");
  
  // Deploy the contract with constructor arguments
  const tuitionEscrow = await TuitionEscrow.deploy(
    TUSDC_TOKEN_ADDRESS,
    INITIAL_ADMIN_ADDRESS
  );
  
  // Wait for deployment to complete
  await tuitionEscrow.waitForDeployment();
  
  const contractAddress = await tuitionEscrow.getAddress();
  console.log("TuitionEscrow deployed to:", contractAddress);
  
  // Verify deployment by checking contract code
  const deployedCode = await ethers.provider.getCode(contractAddress);
  if (deployedCode === "0x") {
    throw new Error("Contract deployment failed - no code at address");
  }
  
  // Verify constructor parameters were set correctly
  console.log("\nVerifying deployment...");
  
  try {
    const tusdcTokenAddress = await tuitionEscrow.tusdcToken();
    console.log("Verified tUSDC token address:", tusdcTokenAddress);
    
    // Check if initial admin has the required roles
    const DEFAULT_ADMIN_ROLE = await tuitionEscrow.DEFAULT_ADMIN_ROLE();
    const ADMIN_ROLE = await tuitionEscrow.ADMIN_ROLE();
    
    const hasDefaultAdminRole = await tuitionEscrow.hasRole(DEFAULT_ADMIN_ROLE, INITIAL_ADMIN_ADDRESS);
    const hasAdminRole = await tuitionEscrow.hasRole(ADMIN_ROLE, INITIAL_ADMIN_ADDRESS);
    
    console.log("Initial admin has DEFAULT_ADMIN_ROLE:", hasDefaultAdminRole);
    console.log("Initial admin has ADMIN_ROLE:", hasAdminRole);
    
    if (!hasDefaultAdminRole || !hasAdminRole) {
      console.warn("Warning: Initial admin doesn't have expected roles");
    }
    
  } catch (error) {
    console.error("Error during deployment verification:", error.message);
  }
  
  // Log deployment summary
  console.log("\n" + "=".repeat(50));
  console.log("DEPLOYMENT SUMMARY");
  console.log("=".repeat(50));
  console.log("Contract Name: TuitionEscrow");
  console.log("Contract Address:", contractAddress);
  console.log("tUSDC Token Address:", TUSDC_TOKEN_ADDRESS);
  console.log("Initial Admin Address:", INITIAL_ADMIN_ADDRESS);
  console.log("Deployer Address:", deployer.address);
  console.log("Network:", await ethers.provider.getNetwork().then(n => n.name));
  console.log("Gas Used: Check transaction receipt for details");
  console.log("=".repeat(50));
  
  // Optional: Save deployment info to file
  const deploymentInfo = {
    contractName: "TuitionEscrow",
    contractAddress: contractAddress,
    tusdcTokenAddress: TUSDC_TOKEN_ADDRESS,
    initialAdminAddress: INITIAL_ADMIN_ADDRESS,
    deployerAddress: deployer.address,
    network: await ethers.provider.getNetwork().then(n => n.name),
    deploymentDate: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber()
  };
  
  
  // Return contract instance for use in scripts
  return {
    contract: tuitionEscrow,
    address: contractAddress,
    deploymentInfo
  };
}

// Execute deployment
main()
  .then((result) => {
    console.log("\nDeployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nDeployment failed:");
    console.error(error);
    process.exit(1);
  });

// Export for use in other scripts
module.exports = { main };