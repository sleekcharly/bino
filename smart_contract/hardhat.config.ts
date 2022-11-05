// https://eth-goerli.g.alchemy.com/v2/o16-wYH2ptBLizQYlO6c7FpjX28GQZ1x

import '@nomiclabs/hardhat-waffle';

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/o16-wYH2ptBLizQYlO6c7FpjX28GQZ1x',
      accounts: [
        '91bcff4cdf6c5b9b8c99add1d110c330279f0845d5472ff5474e65011bc0076e',
      ],
    },
  },
};
