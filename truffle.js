const HDWalletProvider = require("@truffle/hdwallet-provider");

const mnemonic = "";

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*'
    }, 
    rinkeby: {
      networkCheckTimeout: 20000, 
      provider: function(){
         return new HDWalletProvider(mnemonic, "") 
      },
      network_id: 4,
      gas: 5500000,
      gasPrice: 10000000000,
      skipDryRun: true,
      // confirmations: 10,
      timeoutBlocks: 2000,
    }
  },
  contracts_directory: './contracts/',
  contracts_build_directory: './abis/',
  compilers: {
    solc: {
      version: "^0.8.3",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
