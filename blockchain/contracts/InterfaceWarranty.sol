// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface InterfaceWarranty is IERC721 {

    ///---------------------------------------------------------------------------------------------------------------------
    ///---------------------------------------------------------------------------------------------------------------------

    /** 
     * @dev Various events emitted in the contract.
    */ 


    event WarrantyCardMinted(address indexed to, uint256 tokenId, string tokenURI, uint256 warrantyLengthInDays);
    event WarrantyPeriodStarted(uint256 tokenId, uint256 startTime, uint256 length);
    event Attest(address indexed to, uint256 tokenId);
    event Revoke(address indexed to, uint256 tokenId);
    event MarketTranfer(address indexed to, uint256 tokenId);

    function startWarrantyPeriod(uint256 tokenId, address originSender) external;

    function checkIfWarrantyIsOver(uint256 tokenId) external view returns(uint);

    function getWarrantyPeriod(uint256 tokenId) external view returns (uint);

    function totalTokens() external view returns (uint);

    function getContractOwner() external view returns (address);


}