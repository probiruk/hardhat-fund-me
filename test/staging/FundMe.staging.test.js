const { ethers, getNamedAccounts } = require('hardhat')
const { developmentChains } = require('../../helper-hardhat-config')
const { assert } = require('chai')

function tokens(n) {
    return ethers.utils.parseEther(n, 'ether')
}

developmentChains.includes(network.name)
    ? describe.skip
    : describe('FundMe', () => {
          let fundMe
          let deployer

          const sendAmount = tokens('0.035')

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract('FundMe', deployer)
          })

          it('allows people to fund and withdraw', async () => {
              await fundMe.fund({ value: sendAmount })
              await fundMe.withdraw()

              const endingFundMeBalance = (
                  await fundMe.provider.getBalance(fundMe.address)
              ).toString()
              console.log(
                  `running asert equal that ${endingFundMeBalance} should be equal to 0`
              )
              assert.equal(endingFundMeBalance, '0')
          })
      })
