const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Warranty NFT Test', function () {
  let NFTdeployer, addr1, addr2, warranty, tokenName, tokenSymbol;

  beforeEach(async function () {
    [NFTdeployer, addr1, addr2] = await ethers.getSigners();
    tokenName = 'Nike NFT';
    tokenSymbol = 'NKT';
    const Warranty = await ethers.getContractFactory('Warranty');
    warranty = await Warranty.deploy(tokenName, tokenSymbol);
    await warranty.deployed();
  });

  describe('Deployment', function () {
    it('Should have correct name and symbol', async function () {
      expect(await warranty.name()).to.equal(tokenName);
      expect(await warranty.symbol()).to.equal(tokenSymbol);
    });
  });

  describe('Mint Warranty', function () {
    it('Should mint only 1 NFT with same URI', async function () {
      let newMintItem = {
        id: 0,
        ipfsHash: 'QmYwAPJzv5CZsnA625sXf2nemtYgPpHdWEz79ojWnPbdG',
        uri: 'ipfs://Qme3QxqsJih5psasse4d2FFLFLwaKx7wHXW3Topk3Q8b14',
      };
      await expect(
        warranty.safeMint(
          NFTdeployer.address,
          newMintItem.ipfsHash,
          newMintItem.uri
        )
      )
        .to.emit(warranty, 'WarrantyCardMinted')
        .withArgs(NFTdeployer.address, newMintItem.id, newMintItem.uri);

      await expect(
        warranty.safeMint(
          NFTdeployer.address,
          newMintItem.ipfsHash,
          newMintItem.uri
        )
      ).to.be.revertedWith('Warranty: already minted');
    });
  });
});
