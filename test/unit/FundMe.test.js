const { deployments, ethers, getNamedAccounts, network } = require('hardhat')
const { developmentChains } = require('../../helper-hardhat-config')
const { assert } = require('chai')
require('chai').use(require('chai-as-promised')).should()

function tokens(n) {
    return ethers.utils.parseEther(n, 'ether')
}

!developmentChains.includes(network.name)
    ? describe.skip
    : describe('FundMe', () => {
          let deployer
          let user
          let fundMe
          let mockV3Aggregator

          const sendAmount = tokens('1')

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              user = (await getNamedAccounts()).user

              // deploy all the contracts with tag "all"
              await deployments.fixture(['all'])

              fundMe = await ethers.getContract('FundMe', deployer)
              mockV3Aggregator = await ethers.getContract(
                  'MockV3Aggregator',
                  deployer
              )
          })

          describe('constructor', async () => {
              it('sets the owner of the contract to deployer', async () => {
                  const response = await fundMe.getOwner()
                  assert.equal(response, deployer)
              })
              it('sets the aggregator addresses correctly', async () => {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.address)
              })
          })

          describe('getPriceFeedVerison', async () => {
              it('return the current priceFeed verison using', async () => {
                  const response = await fundMe.getPriceFeedVersion().should.be
                      .fulfilled
                  assert.notEqual(response, null)
              })
          })

          describe('fund', async () => {
              it('fails if you dont we send enough ETH', async () => {
                  await fundMe.fund().should.be.rejected
              })

              it('updates addressToAmountFunded state', async () => {
                  await fundMe.fund({ value: sendAmount })
                  const addressToAmountFunded =
                      await fundMe.getAddressToAmountFunded(deployer)
                  assert.equal(
                      addressToAmountFunded.toString(),
                      sendAmount.toString()
                  )
              })

              it('adds funder to array of funders', async () => {
                  await fundMe.fund({ value: sendAmount })
                  const funders = await fundMe.getFunder(0)
                  assert.equal(funders, deployer)
              })
          })

          describe('withdraw', async () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendAmount })
              })

              it('fails if the caller is not the owner', async () => {
                  await fundMe.connect(user).withdraw().should.be.rejected
              })

              it('resets addressToAmountFunded state', async () => {
                  await fundMe.withdraw()
                  const addressToAmountFunded =
                      await fundMe.getAddressToAmountFunded(deployer)
                  assert.equal(addressToAmountFunded.toString(), '0')
              })

              it('resets funders array', async () => {
                  await fundMe.withdraw()
                  await fundMe.getFunder(0).should.be.rejected
              })

              it('send the funds to the owner', async () => {
                  const contractBalanceBefore =
                      await fundMe.provider.getBalance(fundMe.address)
                  const ownerBalanceBefore = await fundMe.provider.getBalance(
                      deployer
                  )

                  const transactionResponse = await fundMe.withdraw()
                  const transactionRecipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionRecipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const contractBalanceAfter = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const ownerBalanceAfter = await fundMe.provider.getBalance(
                      deployer
                  )

                  assert.equal(contractBalanceAfter.toString(), '0')
                  assert.equal(
                      ownerBalanceBefore.add(contractBalanceBefore).toString(),
                      ownerBalanceAfter.add(gasCost).toString()
                  )
              })
          })
      })
