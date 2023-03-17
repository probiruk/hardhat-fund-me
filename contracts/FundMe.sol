// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import { AggregatorV3Interface } from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import { PriceConverter } from "./PriceConverter.sol";

error FundMe__NotOwner();
error FundMe__MINIMUM_USD_NOT_MET();
error FundMe__WITHDRAW_FAILED();

contract FundMe {
    using PriceConverter for uint256;

    mapping(address => uint256) private s_addressToAmountFunded;
    address[] private s_funders;
    AggregatorV3Interface private s_priceFeed;

    address private i_owner;
    uint256 public constant MINIMUM_USD = 50 * 10 ** 18;
    

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    modifier onlyOwner {
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    function fund() public payable {
        if(msg.value.getConversionRate(s_priceFeed) < MINIMUM_USD) revert FundMe__MINIMUM_USD_NOT_MET();
        
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
    }
    
    function withdraw() public onlyOwner {
        address[] memory funders = s_funders;

        for (uint256 funderIndex=0; funderIndex < funders.length; funderIndex++){
            s_addressToAmountFunded[funders[funderIndex]] = 0;
        }
        
        s_funders = new address[](0);
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        
        if(!callSuccess) revert FundMe__WITHDRAW_FAILED();
    }

    function getAddressToAmountFunded(address funderAddress) public view returns (uint256) {
        return s_addressToAmountFunded[funderAddress];
    }

    function getFunder(uint256 funderIndex) public view returns (address) {
        return s_funders[funderIndex];
    }


    function getPriceFeed() public view returns(AggregatorV3Interface) {
        return s_priceFeed;
    }

    function getPriceFeedVersion() public view returns (uint256){
        return s_priceFeed.version();
    }

    function getOwner() public view returns(address) {
        return i_owner;
    }
}
