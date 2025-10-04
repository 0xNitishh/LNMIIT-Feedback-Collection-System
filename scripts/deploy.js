const { ethers } = require("hardhat");

async function main() {
  const FeedbackContract = await ethers.getContractFactory("FeedbackContract");
  
  console.log("Deploying FeedbackContract...");
  
  const feedbackContract = await FeedbackContract.deploy();
  await feedbackContract.deployed();

  console.log("FeedbackContract deployed to:", feedbackContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});