const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require("fs");

const mnemonic = fs.readFileSync(".secret").toString().trim();
const ropstenEndpoint = process.env.REACT_APP_ROPSTEN_ENDPOINT;

module.exports = {
    contracts_build_directory: "./build",
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*",
        },
        ropsten: {
            provider: function () {
                return new HDWalletProvider(mnemonic, ropstenEndpoint);
            },
            network_id: 3,
            gas: 8000000,
        },
    },
    compilers: {
        solc: {
          version: "0.8.4",    
        }
      },
};
