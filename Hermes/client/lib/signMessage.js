// export const checkWeb3 = async () => {
//   let address;
//   console.log('check web3 support');

//   if (typeof window.ethereum !== 'undefined') {
//     const [account] = await window.ethereum.request({
//       method: 'eth_requestAccounts',
//     });

//     address = account;

//     window.ethereum.on('accountsChanged', function (accounts) {
//       account = accounts[0];
//       console.log('address changed ' + accounts[0]);
//     });
//   } else {
//     alert('Please download metamask');
//     address = '';
//   }

//   return new Promise(function (resolve, reject) {
//     resolve({ address });
//   });
// };

import { ethers } from 'ethers';

export async function signMessage(address) {
  try {
    // const response = await fetch(
    //   `http://localhost:5050/brand/nonce/${address}`
    // );
    // const { nonce } = await response.json();

    // generate random number
    const nonce = '' + Math.floor(Math.random() * 10000);

    const nonceHex = ethers.utils.hexlify(ethers.utils.toUtf8Bytes('' + nonce));

    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [nonceHex, address],
    });

    return new Promise(function (resolve, reject) {
      resolve({ signature, address });
    });
  } catch (error) {
    console.log(error);
    return new Promise(function (resolve, reject) {
      reject({ error });
    });
  }
}
