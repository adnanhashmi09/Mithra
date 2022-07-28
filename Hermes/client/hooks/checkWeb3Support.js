import { useEffect, useState, useContext } from 'react';
import { useStateContext } from '../context/StateContext';
import { useRouter } from 'next/router';

const useCheckWeb3Support = () => {
  const { address, setAddress } = useStateContext();
  const router = useRouter();
  console.log('check web3 support');
  useEffect(() => {
    async function fetchAccount() {
      if (typeof window.ethereum !== 'undefined') {
        const [account] = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        setAddress(account);

        window.ethereum.on('accountsChanged', function (accounts) {
          setAddress(accounts[0]);
          console.log('address changed ' + accounts[0]);
        });
      } else {
        alert('Please download metamask');
        setAddress('');
      }
    }

    fetchAccount();
    // if (address === '') {
    //   alert('Please connect to or download metamask');
    //   router.push('/');
    // }
  }, []);
};

export default useCheckWeb3Support;
