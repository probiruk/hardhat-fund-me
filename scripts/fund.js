const { getNamedAccounts, ethers } = require('hardhat')

function tokens(n) {
    return ethers.utils.parseEther(n, 'ether')
}

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContract('FundMe', deployer)

    console.log('Funding contract...')
    await fundMe.fund({ value: tokens('0.35') })
    console.log('Funded!')
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
