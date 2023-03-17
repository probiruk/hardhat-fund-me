require('@nomicfoundation/hardhat-toolbox')
require('hardhat-deploy')
require('dotenv').config()

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const GOERLI_DEPLOYER_PRIVATE_KEY = process.env.GOERLI_DEPLOYER_PRIVATE_KEY
const GOERLI_USER_PRIVATE_KEY = process.env.GOERLI_USER_PRIVATE_KEY

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

module.exports = {
    solidity: {
        compilers: [
            {
                version: '0.8.7',
            },
            {
                version: '0.6.6',
            },
        ],
    },
    defaultNetwork: 'hardhat',
    networks: {
        localhost: {
            url: 'http://127.0.0.1:8545',
            chainId: 31337,
        },
        goerli: {
            url: GOERLI_RPC_URL,
            chainId: 5,
            accounts: [GOERLI_DEPLOYER_PRIVATE_KEY, GOERLI_USER_PRIVATE_KEY],
            blockConfirmations: 6,
        },
    },
    gasReporter: {
        enabled: true,
        outputFile: 'gas-report.txt',
        noColors: true,
        currency: 'USD',
        coinmarketcap: COINMARKETCAP_API_KEY,
        token: 'ETH',
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    namedAccounts: {
        deployer: 0,
        user: 1,
    },
}
