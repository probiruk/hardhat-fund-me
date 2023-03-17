const { network } = require('hardhat')
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require('../helper-hardhat-config')

const deploy = async (hre) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if (developmentChains.includes(network.name)) {
        log('Local network detected! deloying mocks..')
        const mock = await deploy('MockV3Aggregator', {
            from: deployer,
            args: [DECIMALS, INITIAL_ANSWER],
            log: true,
        })
        log(`MockV3Aggregator Contract deployed at ${mock.address}`)
        log('--------------------------------------')
    } else {
        log(
            'Skipping MockV3Aggregator deployments since the network is not on development chains'
        )
    }
}

module.exports = deploy
module.exports.tags = ['all', 'mocks']
