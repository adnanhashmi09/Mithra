// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./openzeppelin/contracts/access/Ownable.sol";
import "./openzeppelin/contracts/utils/Counters.sol";
import "./InterfaceWarranty.sol";


/// @title A contract which manages and keeps track of all the different warranty cards.
/// @author Adnan Hashmi
/// @notice For now this contract does nothing`

contract WarrantyMarket is ReentrancyGuard, Ownable{

    using Counters for Counters.Counter;

    struct Item{
        uint itemId;
        InterfaceWarranty nft;
        uint tokenId;
        address currentOwner;    
        address createdBy;
    }

    // state variables
    Counters.Counter private _itemCount;
    mapping (uint256 => Item) private items;


    constructor(){}

    ///---------------------------------------------------------------------------------------------------------------------
    ///---------------------------------------------------------------------------------------------------------------------

    /** 
     * @dev Various events emitted in the contract.
    */ 

    event ListedInMarket(uint256 itemId, uint256 tokenId, address indexed currentOwner, address indexed createdBy); 
    event WarrantyCardTransferredToBuyer(uint256 itemId, address indexed recipient, address indexed createdBy); 

    ///---------------------------------------------------------------------------------------------------------------------
    ///---------------------------------------------------------------------------------------------------------------------

    /** 

     * @dev This function lists the Warranty card in the market
       @param _nft The warranty card nft of interface type to be listed
       @param tokenId The warranty card tokenId to be listed in the market
    */ 

    function listWarrantyCard(InterfaceWarranty _nft, uint256 tokenId) external nonReentrant {
        require(_nft.getContractOwner() == msg.sender, "Not the owner of the NFT.");
        require(_nft.totalTokens() > tokenId, "Token doesn't exist.");

        uint256 newItemId = _itemCount.current();
        _itemCount.increment();
        address _createdBy = _nft.ownerOf(tokenId);

        _nft.transferFrom(msg.sender, address(this), tokenId);
        
        items[newItemId] = Item(newItemId, _nft, tokenId, _nft.ownerOf(tokenId), _createdBy);

        emit ListedInMarket(newItemId, tokenId, items[newItemId].currentOwner, items[newItemId].createdBy);
    }

    ///---------------------------------------------------------------------------------------------------------------------
    ///---------------------------------------------------------------------------------------------------------------------

    /** 

     * @dev This function transfers the warranty card to the owner of the product
    */ 

    function transferWarrantyCard(address recipient, uint256 itemId) public nonReentrant onlyOwner{
        require(itemId < _itemCount.current(), "Item doesn't exist.");
        items[itemId].nft.transferFrom(address(this), recipient, items[itemId].tokenId);
        items[itemId].nft.startWarrantyPeriod(items[itemId].tokenId, address(this));
        items[itemId].currentOwner = recipient;
         
        emit WarrantyCardTransferredToBuyer(itemId, recipient, items[itemId].createdBy);
    }

    ///---------------------------------------------------------------------------------------------------------------------
    ///---------------------------------------------------------------------------------------------------------------------

    /** 

     * @dev This function handles the resale of the token (basically transferring the token to the new owner)
    */ 

    function Resale(address recipient, uint256 itemId) public nonReentrant{
        require(itemId < _itemCount.current(), "Item doesn't exist.");
        require(recipient!=address(this), "You can't transfer to yourself.");
        require(recipient!=address(0), "You can't transfer to the null address.");

        items[itemId].nft.transferFrom(items[itemId].currentOwner, recipient, items[itemId].tokenId);
        items[itemId].currentOwner = recipient;
         
        emit WarrantyCardTransferredToBuyer(itemId, recipient, items[itemId].createdBy);
    }
    
}   
