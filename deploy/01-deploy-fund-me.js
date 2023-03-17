const { network } = require('hardhat')
const { networkConfig, developmentChains } = require('../helper-hardhat-config')
const { verify } = require('../utils/verify')
require('dotenv').config()

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

const deploy = async (hre) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        ethUsdPriceFeedAddress = (await deployments.get('MockV3Aggregator'))
            .address
    } else {
        ethUsdPriceFeedAddress =
            networkConfig[chainId]['ethUsdPriceFeedAddress']
    }

    const args = [ethUsdPriceFeedAddress]

    const fundMe = await deploy('FundMe', {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log(`FundMe Contract deployed at ${fundMe.address}`)

    if (!developmentChains.includes(network.name) && ETHERSCAN_API_KEY) {
        await verify(fundMe.address, args)
    }

    log('--------------------------------------')
}

module.exports = deploy
module.exports.tags = ['all', 'fundme']
