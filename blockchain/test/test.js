const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Warranty NFT Test', function () {
  let NFTdeployer, addr1, addr2, warranty, marketPlace, tokenName, tokenSymbol;

  beforeEach(async function () {
    [NFTdeployer, addr1, addr2] = await ethers.getSigners();
    tokenName = 'Nike NFT';
    tokenSymbol = 'NKT';

    const MarketPlace = await ethers.getContractFactory('WarrantyMarket');
    marketPlace = await MarketPlace.deploy();
    await marketPlace.deployed();

    const Warranty = await ethers.getContractFactory('Warranty');
    warranty = await Warranty.deploy(
      tokenName,
      tokenSymbol,
      marketPlace.address
    );
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
          newMintItem.uri,
          10
        )
      )
        .to.emit(warranty, 'WarrantyCardMinted')
        .withArgs(NFTdeployer.address, newMintItem.id, newMintItem.uri, 10);

      await expect(
        warranty.safeMint(
          NFTdeployer.address,
          newMintItem.ipfsHash,
          newMintItem.uri,
          10
        )
      ).to.be.revertedWith('Warranty: already minted');
    });

    it('Warranty status is set to false when first minted', async function () {
      await warranty.safeMint(
        NFTdeployer.address,
        'QmYwAPJzv5CZsnA625sXf2nemtYgPpHdWEz79ojWnPbdG',
        'ipfs://Qme3QxqsJih5psasse4d2FFLFLwaKx7wHXW3Topk3Q8b14',
        10
      );

      expect(await warranty.hasWarrantyStarted(0)).to.equal(false);
    });

    it('Warranty period started correctly', async function () {
      await warranty.safeMint(
        NFTdeployer.address,
        'QmYwAPJzv5CZsnA625sXf2nemtYgPpHdWEz79ojWnPbdG',
        'ipfs://Qme3QxqsJih5psasse4d2FFLFLwaKx7wHXW3Topk3Q8b14',
        10
      );

      await expect(
        warranty.startWarrantyPeriod(0, addr1.address)
      ).to.be.revertedWith(
        'Warranty: only contract owner can start the warranty period'
      );

      await expect(
        warranty.startWarrantyPeriod(0, NFTdeployer.address)
      ).to.emit(warranty, 'WarrantyPeriodStarted');

      await expect(
        warranty.startWarrantyPeriod(0, NFTdeployer.address)
      ).to.be.revertedWith('Warranty has already started');
    });
  });

  describe('List warranty', function () {
    it('  ', async function () {});
    it('', async function () {});
  });
});
