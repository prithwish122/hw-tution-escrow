const { ethers } = require("hardhat");

async function main() {
  console.log("Starting TestUSDC deployment...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");
  
  // Get the contract factory
  const TestUSDC = await ethers.getContractFactory("TestUSDC");
  
  console.log("\nDeploying TestUSDC contract...");
  
  // Deploy the contract (no constructor arguments needed)
  const testUSDC = await TestUSDC.deploy();
  
  // Wait for deployment to complete
  await testUSDC.waitForDeployment();
  
  const contractAddress = await testUSDC.getAddress();
  console.log("TestUSDC deployed to:", contractAddress);
  
  // Verify deployment by checking contract code
  const deployedCode = await ethers.provider.getCode(contractAddress);
  if (deployedCode === "0x") {
    throw new Error("Contract deployment failed - no code at address");
  }
  
  // Verify token properties
  console.log("\nVerifying token properties...");
  
  try {
    const name = await testUSDC.name();
    const symbol = await testUSDC.symbol();
    const decimals = await testUSDC.decimals();
    const totalSupply = await testUSDC.totalSupply();
    const deployerBalance = await testUSDC.balanceOf(deployer.address);
    
    console.log("Token Name:", name);
    console.log("Token Symbol:", symbol);
    console.log("Token Decimals:", decimals.toString());
    console.log("Total Supply:", ethers.formatUnits(totalSupply, decimals), symbol);
    console.log("Deployer Balance:", ethers.formatUnits(deployerBalance, decimals), symbol);
    
    // Verify that deployer received the initial mint (1M tokens)
    const expectedInitialSupply = 1000000n * (10n ** BigInt(decimals));
    if (totalSupply !== expectedInitialSupply) {
      console.warn("Warning: Total supply doesn't match expected initial mint");
    }
    
    if (deployerBalance !== totalSupply) {
      console.warn("Warning: Deployer didn't receive all initial tokens");
    }
    
  } catch (error) {
    console.error("Error during token verification:", error.message);
  }
  
  // Test minting functionality (optional)
  console.log("\nTesting mint functionality...");
  
  try {
    const testMintAmount = ethers.parseUnits("1000", 6); // Mint 1000 tUSDC
    const mintTx = await testUSDC.mint(deployer.address, testMintAmount);
    await mintTx.wait();
    
    const newBalance = await testUSDC.balanceOf(deployer.address);
    console.log("After test mint - Deployer Balance:", ethers.formatUnits(newBalance, 6), "tUSDC");
    console.log("✅ Mint function working correctly");
    
  } catch (error) {
    console.error("❌ Error testing mint function:", error.message);
  }
  
  // Log deployment summary
  console.log("\n" + "=".repeat(50));
  console.log("DEPLOYMENT SUMMARY");
  console.log("=".repeat(50));
  console.log("Contract Name: TestUSDC");
  console.log("Contract Address:", contractAddress);
  console.log("Token Name: Test USDC");
  console.log("Token Symbol: tUSDC");
  console.log("Token Decimals: 6");
  console.log("Initial Supply: 1,000,000 tUSDC");
  console.log("Deployer Address:", deployer.address);
  console.log("Network:", await ethers.provider.getNetwork().then(n => n.name));
  console.log("=".repeat(50));
  
  // Usage instructions
  console.log("\n" + "📋 USAGE INSTRUCTIONS:");
  console.log("1. Use this contract address as the tUSDC token address in TuitionEscrow deployment");
  console.log("2. Anyone can mint tokens using: testUSDC.mint(address, amount)");
  console.log("3. Remember to approve the TuitionEscrow contract before making deposits");
  console.log("4. Example approval: testUSDC.approve(escrowAddress, amount)");
  
  // Contract interaction examples
  console.log("\n" + "💻 CONTRACT INTERACTION EXAMPLES:");
  console.log(`// Get token balance`);
  console.log(`const balance = await testUSDC.balanceOf("${deployer.address}");`);
  console.log(`// Mint tokens to an address`);
  console.log(`await testUSDC.mint("0x...", ethers.parseUnits("1000", 6));`);
  console.log(`// Approve escrow contract`);
  console.log(`await testUSDC.approve(escrowAddress, ethers.parseUnits("500", 6));`);
  
  // Save deployment info
  const deploymentInfo = {
    contractName: "TestUSDC",
    contractAddress: contractAddress,
    tokenName: "Test USDC",
    tokenSymbol: "tUSDC",
    decimals: 6,
    initialSupply: "1000000",
    deployerAddress: deployer.address,
    network: await ethers.provider.getNetwork().then(n => n.name),
    deploymentDate: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
    mintFunction: "Available - anyone can mint",
    usageNotes: [
      "This is a test token for development only",
      "Use this address in TuitionEscrow deployment",
      "Tokens can be minted freely by anyone",
      "Remember to approve before transfers"
    ]
  };
  
  // Optional: Save deployment info to file
  // Uncomment the following lines to save deployment info to a JSON file
  /*
  const fs = require('fs');
  const deploymentPath = `./deployments/${await ethers.provider.getNetwork().then(n => n.name)}/`;
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(deploymentPath)) {
    fs.mkdirSync(deploymentPath, { recursive: true });
  }
  
  fs.writeFileSync(
    `${deploymentPath}TestUSDC.json`, 
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log(`\nDeployment info saved to ${deploymentPath}TestUSDC.json`);
  */
  
  // Return contract instance and info for use in other scripts
  return {
    contract: testUSDC,
    address: contractAddress,
    deploymentInfo
  };
}

// Execute deployment
main()
  .then((result) => {
    console.log("\n✅ TestUSDC deployment completed successfully!");
    console.log("\n🔗 Copy this address for your TuitionEscrow deployment:");
    console.log(result.address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ TestUSDC deployment failed:");
    console.error(error);
    process.exit(1);
  });

// Export for use in other scripts
module.exports = { main };