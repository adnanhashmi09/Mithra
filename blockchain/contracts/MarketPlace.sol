// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title A contract which manages and keeps track of all the different warranty cards.
/// @author Adnan Hashmi
/// @notice For now this contract does nothing

contract WarrantyMarket is ReentrancyGuard{

    // state variables
    address warrantyMarketOwner;

    constructor(){
        warrantyMarketOwner = msg.sender;
    }
}
