import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

// setup react context
export const TransactionContext = React.createContext({});

// destructure ethereum object from window
const { ethereum }: any = window;

// special function for retrieving etherum contract
const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  // get signer
  const signer = provider.getSigner();
  // get transaction cntract
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer,
  );

  return transactionContract;
};

// create TransactionProvider
export const TransactionProvider = ({ children }: any) => {
  // create application state
  const [currentAccount, setCurrentAccount] = useState('');
  const [formData, setFormData] = useState({
    addressTo: '',
    amount: '',
    keyword: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem('transactionCount'),
  );
  const [transactions, setTransactions] = useState([]);

  // handle form data change
  const handleChange = (e: { target: { value: any } }, name: any) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  // get all transactions
  const getAllTransactions = async () => {
    try {
      if (!ethereum) return alert('Please install metamask');

      const transactionContract = getEthereumContract();
      const availableTransactions =
        await transactionContract.getAllTransactions();

      const structuredTransactions = availableTransactions.map(
        (transaction: any) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(
            transaction.timestamp.toNumber() * 1000,
          ).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
        }),
      );

      setTransactions(structuredTransactions);
    } catch (error) {
      console.log(error);
    }
  };

  // check if wallet is connected
  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert('Please install metamask');

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        // get all transactions
        getAllTransactions();
      } else {
        console.log('No accounts found');
      }
    } catch (error) {
      console.log(error);

      throw new Error('No etherum object.');
    }
  };

  // check if the wallet exists
  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionContract = getEthereumContract();
        const currentTransactionCount =
          await transactionContract.getTransactionCount();

        window.localStorage.setItem(
          'transactionCount',
          currentTransactionCount,
        );
      }
    } catch (error) {
      console.log(error);

      throw new Error('No ethereum object');
    }
  };

  //connect wallet function
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert('Please install metamask!');

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);

      throw new Error('No etherum object.');
    }
  };

  // function for sending transactions
  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert('Please install metamask');

      // get the data from the form
      const { addressTo, amount, keyword, message } = formData;
      // get ethereum contract
      const transactionsContract = getEthereumContract();
      //convert amount to GWEI
      const parsedAmount = ethers.utils.parseEther(amount);

      // send ethereum
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: '0x5208', // hexadecimal number (21000 GWEI)
            value: parsedAmount._hex,
          },
        ],
      });

      // add transaction to blockchain
      const transactionHash = await transactionsContract.addToBlockChain(
        addressTo,
        parsedAmount,
        message,
        keyword,
      );

      // set loading state
      setIsLoading(true);
      console.log(`loading - ${transactionHash.hash}`);

      // await transaction hash
      await transactionHash.wait();

      // set loading state
      setIsLoading(false);
      console.log(`success - ${transactionHash.hash}`);

      // get transaction count
      const transactionCount = await transactionsContract.getTransactionCount();
      setTransactionCount(transactionCount.toNumber());

      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error('No ethereum object.');
    }
  };

  // run wallet check on application load
  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExists();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setFormData,
        handleChange,
        sendTransaction,
        transactions,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
