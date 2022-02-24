module.exports = {
    contracts_directory: "./truffle/contracts",
    migrations_directory: "./truffle/migrations",
    contracts_build_directory: "./src/contracts/abi",

    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*",
        },
    },
    dashboard: {
        port: 24012,
    },
    compilers: {
        solc: {
            version: "0.8.4",
        },
    },
};
