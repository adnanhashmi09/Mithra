// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


/// @title A contract for Warranty Card with Decay functionality
/// @author Adnan Hashmi
/// @notice For now this contract only mints a Soulbound NFT

contract Warranty is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    /// @dev state variables
    Counters.Counter private _tokenIdCounter; // keeps track of the ids of warranty cards
    address public ownerOfNFTContract; 

    constructor(string memory tokenName, string memory tokenSymbol) ERC721(tokenName, tokenSymbol) {
        ownerOfNFTContract = msg.sender;
    }

    ///---------------------------------------------------------------------------------------------------------------------
    ///---------------------------------------------------------------------------------------------------------------------

    /** 
     * @dev Various events emitted in the contract.
    */ 

    event WarrantyCardMinted(address indexed to, uint256 tokenId, string tokenURI);
    event Attest(address indexed to, uint256 tokenId);
    event Revoke(address indexed to, uint256 tokenId);
    
    mapping(string => uint256) public warrantyCount; // to track only one warranty card per ipfs hash

    ///---------------------------------------------------------------------------------------------------------------------
    ///---------------------------------------------------------------------------------------------------------------------

    /** 

     * @dev This function mints a Soulbound NFT to the given address.
       @param to The address to which the Warranty Card is to be minted. 
       @param ipfsHash The ipfs hash of the artifact.
       @param uri The tokenURI of the artifact from ipfs.
    
    */ 

    function safeMint(address to, string memory ipfsHash, string memory uri) public onlyOwner returns(uint) {
        require(warrantyCount[ipfsHash] != 1, "Warranty: already minted");
        warrantyCount[ipfsHash] = 1;
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit WarrantyCardMinted(to, tokenId, uri);
        return tokenId;
    }

    /// @dev The following functions are overrides required by Solidity.

    ///---------------------------------------------------------------------------------------------------------------------
    ///---------------------------------------------------------------------------------------------------------------------

    /** 

     * @dev The following function allows the owner of the Token to burn their warranty card.
       @param tokenId The token id of warranty card to be burned.
    */ 

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        require(ownerOf(tokenId) == msg.sender, "Only token owner can burn their token.");
        super._burn(tokenId);
    }

    ///---------------------------------------------------------------------------------------------------------------------
    ///---------------------------------------------------------------------------------------------------------------------

    /** 

     * @dev The following function runs before the transfer of the warranty card. 
            - We don't allow the owner of the token to transfer their warranty card.
            - We only allow the tranfer of Warranty card when either we are minting the warranty card or burining it.
       @param from The previous owner of the Warranty Card. 
       @param to address of account the Warranty Card is to be transferred to. 
       @param tokenId The tokenId of the warranty card to be transferred.
    */ 
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override virtual {
        require(from == address(0) || to == address(0), "Cannot transfer this token.");
    }

    ///---------------------------------------------------------------------------------------------------------------------
    ///---------------------------------------------------------------------------------------------------------------------

    /** 

     * @dev The following function runs after the transfer of the warranty card. 
            We just emit events here if it is a mint or a burn.
       @param from The previous owner of the Warranty Card. 
       @param to address of account the Warranty Card is to be transferred to. 
       @param tokenId The tokenId of the warranty card which is transferred.
    */ 

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override virtual {
        if(from == address(0)){
           emit Attest(to, tokenId); 
        }else if(to == address(0)){
            emit Revoke(to, tokenId);
        }
    }

    ///---------------------------------------------------------------------------------------------------------------------
    ///---------------------------------------------------------------------------------------------------------------------

    /** 

     * @dev The following function returns the tokenURI associated with a warranty card.
       @param tokenId The tokenId of the warranty card whose tokenURI is to be returned.
    */ 

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
