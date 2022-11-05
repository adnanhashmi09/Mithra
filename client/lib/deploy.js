import { ethers, ContractFactory } from 'ethers';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import Warranty from '../abi/Warranty.sol/Warranty.json';

let address;

async function deployContract(tokenName, tokenSymbol) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  await useCheckWeb3Support();

  const signer = provider.getSigner(address);
  console.log(signer);
  const factory = new ContractFactory(Warranty.abi, Warranty.bytecode, signer);

  const contract = await factory.deploy(tokenName, tokenSymbol);

  await contract.deployTransaction.wait();

  console.log(contract);

  return new Promise(function (resolve, reject) {
    resolve({ contract, address });
  });
}

export default deployContract;

const useCheckWeb3Support = async () => {
  console.log('check web3 support');

  if (typeof window.ethereum !== 'undefined') {
    const [account] = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    address = account;

    window.ethereum.on('accountsChanged', function (accounts) {
      account = accounts[0];
      console.log('address changed ' + accounts[0]);
    });
  } else {
    alert('Please download metamask');
    address = '';
  }
};
