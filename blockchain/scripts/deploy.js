const hre = require('hardhat');

async function main() {
  const MarketPlace = await hre.ethers.getContractFactory('MarketPlace');
  const marketPlace = await MarketPlace.deploy();
  await marketPlace.deployed();

  const Warranty = await hre.ethers.getContractFactory('Warranty');
  const warranty = await Warranty.deploy(
    'Nike NFT',
    'NKT',
    marketPlace.address
  );
  await warranty.deployed();

  console.log('Warranty deployed to:', warranty.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
