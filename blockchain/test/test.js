const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Warranty NFT Test', function () {
  let NFTdeployer,
    addr1,
    addr2,
    marketPlaceDeployer,
    warranty,
    marketPlace,
    tokenName,
    tokenSymbol;

  beforeEach(async function () {
    [NFTdeployer, addr1, marketPlaceDeployer, addr2] =
      await ethers.getSigners();
    tokenName = 'Nike NFT';
    tokenSymbol = 'NKT';

    const MarketPlace = await ethers.getContractFactory('WarrantyMarket');
    marketPlace = await MarketPlace.connect(marketPlaceDeployer).deploy();
    await marketPlace.deployed();

    const Warranty = await ethers.getContractFactory('Warranty');
    warranty = await Warranty.deploy(
      tokenName,
      tokenSymbol,
      marketPlace.address
    );
    await warranty.deployed();

    // console.table(['NFT', warranty.address]);
    // console.table(['Market', marketPlace.address]);
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

    it('Warranty status is set to true when minted', async function () {
      await warranty.safeMint(
        NFTdeployer.address,
        'QmYwAPJzv5CZsnA625sXf2nemtYgPpHdWEz79ojWnPbdG',
        'ipfs://Qme3QxqsJih5psasse4d2FFLFLwaKx7wHXW3Topk3Q8b14',
        10
      );

      expect(await warranty.hasWarrantyStarted(0)).to.equal(true);
    });

    it('Warranty can only be minted by the contract deployer', async function () {
      await expect(
        warranty
          .connect(addr1)
          .safeMint(
            addr1.address,
            'QmYwAPJzv5CZsnA625sXf2nemtYgPpHdWEz79ojWnPbdG',
            'ipfs://Qme3QxqsJih5psasse4d2FFLFLwaKx7wHXW3Topk3Q8b14',
            10
          )
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    // it('Warranty period started correctly', async function () {
    //   await warranty.safeMint(
    //     NFTdeployer.address,
    //     'QmYwAPJzv5CZsnA625sXf2nemtYgPpHdWEz79ojWnPbdG',
    //     'ipfs://Qme3QxqsJih5psasse4d2FFLFLwaKx7wHXW3Topk3Q8b14',
    //     10
    //   );

    //   await expect(
    //     warranty.startWarrantyPeriod(0, addr1.address)
    //   ).to.be.revertedWith(
    //     'Warranty: only contract owner can start the warranty period'
    //   );

    //   await expect(
    //     warranty.startWarrantyPeriod(0, NFTdeployer.address)
    //   ).to.emit(warranty, 'WarrantyPeriodStarted');

    //   await expect(
    //     warranty.startWarrantyPeriod(0, NFTdeployer.address)
    //   ).to.be.revertedWith('Warranty has already started');
    // });
  });

  describe('Transfer of the warranty card', function () {
    it('Cannot be transferred by any user', async function () {
      await warranty.safeMint(
        addr1.address,
        'QmYwAPJzv5CZsnA625sXf2nemtYgPpHdWEz79ojWnPbdG',
        'ipfs://Qme3QxqsJih5psasse4d2FFLFLwaKx7wHXW3Topk3Q8b14',
        10
      );

      await expect(
        warranty.connect(addr1).transferFrom(addr1.address, addr2.address, 0)
      ).to.be.revertedWith('Warranty: Cannot transfer this token.');
    });

    it('Warranty card cannot be transferred if the user has not listed it for sale', async function () {
      await warranty.safeMint(
        addr1.address,
        'QmYwAPJzv5CZsnA625sXf2nemtYgPpHdWEz79ojWnPbdG',
        'ipfs://Qme3QxqsJih5psasse4d2FFLFLwaKx7wHXW3Topk3Q8b14',
        10
      );

      await expect(
        warranty.connect(NFTdeployer).resale(0, addr2.address)
      ).to.be.revertedWith('Warranty: token is not out for sale');
    });

    it('Warranty card can be transferred by the NFT deployer if the user has listed it for sale', async function () {
      await warranty.safeMint(
        addr1.address,
        'QmYwAPJzv5CZsnA625sXf2nemtYgPpHdWEz79ojWnPbdG',
        'ipfs://Qme3QxqsJih5psasse4d2FFLFLwaKx7wHXW3Topk3Q8b14',
        10
      );

      await warranty.connect(addr1).listForSale(0);

      await expect(
        warranty.connect(NFTdeployer).resale(0, addr2.address)
      ).to.emit(warranty, 'WarrantyCardTransferred');

      expect(await warranty.ownerOf(0)).to.equal(addr2.address);
    });
  });
});
