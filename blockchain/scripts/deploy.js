const hre = require('hardhat');

async function main() {
  const Warranty = await hre.ethers.getContractFactory('Warranty');
  const warranty = await Warranty.deploy('Nike NFT', 'NKT');

  await warranty.deployed();

  console.log('Warranty deployed to:', warranty.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
