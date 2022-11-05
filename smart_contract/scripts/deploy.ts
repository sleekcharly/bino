// Deploying our transactions to the blockchain

import { ethers } from 'hardhat';

const main = async () => {
  const Transactions = await ethers.getContractFactory('Transactions');
  const transactions = await Transactions.deploy();

  await transactions.deployed();

  console.log(`Transactions deployed to: ${transactions.address}`);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // which means the process executed successfully
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
};

// execute the main function
runMain();
