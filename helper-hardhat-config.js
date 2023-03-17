const DECIMALS = 8
const INITIAL_ANSWER = 150000000000

const networkConfig = {
    5: {
        name: 'goerli',
        ethUsdPriceFeedAddress: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
    },
    31337: {
        name: 'hardhat',
        ethUsdPriceFeedAddress: '',
    },
}

const developmentChains = ['hardhat', 'localhost']

module.exports = { networkConfig, developmentChains, DECIMALS, INITIAL_ANSWER }
