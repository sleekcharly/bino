/* Smart Contract for transactions*/

// choose the version of solidity we want to use
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

//  create a contract
// This serves the purpose of a class just like in object oriented programming languages
contract Transactions {
    uint256 transactionCount;  // simple number variable holding number of transactions

    // create a transfer event
    // this is similar to function we could call later on
    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);

    // This declares the object structure of the transfer event
    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    // Define an array of transactions of transfer structures
    TransferStruct[] transactions;

    // create addToBlockchain function
    // declare this function as public so it can be assessed outside the contract class
    function addToBlockChain(address payable receiver, uint amount, string memory message,  string memory keyword) public {
        // add transaction
        // increase transaction count
        transactionCount += 1;
        // push a specific transfer into the transactions array
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));

         // emit the transfer event to be able to be pushed to transactions array
         emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }

    // create all transactions function with a few identifiers aside inclusing public
    function getAllTransactions() public view returns (TransferStruct[] memory){
        // return transactions;
        return transactions;
    }

    // create getTransactionCount function
    function getTransactionCount() public view returns (uint256) {
        // return transactionCount
        return transactionCount;
    }
}