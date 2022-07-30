import React from 'react';
import styles from '../styles/Approval.module.css';
import Link from 'next/link';
import Image from 'next/image';

import { checkWeb3, signMessage } from '../lib/checkWeb3';
import { ethers } from 'ethers';

import Warranty from '../../blockchain/artifacts/contracts/Warranty.sol/Warranty.json';
import toast from 'react-hot-toast';

function Approval({
  productId,
  brandAddress,
  brand,
  owner,
  name,
  tokenUri,
  saleDate,
  contractAddress,
  tab,
  tokenId,
}) {
  const handleApproval = async (e) => {
    e.preventDefault();
    const response = await signMessage(brandAddress);

    console.log(response.error);
    if (response.error) {
      toast.error(
        'Signature not valid. Please connect with your wallet and reload.'
      );
    }

    const res = await fetch('http://localhost:5050/token/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: productId,
        ethAddress: response.address,
        signature: response.signature,
      }),
    });
    const data = await res.json();
    console.log(data);

    const date1 = new Date();
    const today = date1.setFullYear(date1.getFullYear() + 0);
    const date2 = date1.setFullYear(date1.getFullYear() + data.response.period);
    const diffTime = Math.abs(date2 - today);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    mintToken(
      data.response.approval.to,
      data.response.metaHash,
      data.response.tokenUri,
      days
    ); // get a txnHash here

    // approval.To = ''; // replace txnHash here
    // const resp = await signMessage(brandAddress);

    // console.log(resp.error);
    // if (response.error) {
    //   toast.error(
    //     'Signature not valid. Please connect with your wallet and reload.'
    //   );
    // }

    // const txnRsp = await fetch('http://localhost:5050/token/approve/add', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     Approval: approval,
    //     productId: productId,
    //     ethAddress: response.address,
    //     signature: response.signature,
    //   }),
    // });
    // const dat = await res.json();
    // console.log(dat);
  };

  const transferTokenToNewUser = async (to) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        Warranty.abi,
        signer
      );

      const txn = await contract.resale(tokenId, to);
      const prm = txn.wait();

      contract.on('WarrantyCardMinted', (from, to, value, event) => {
        console.log({
          from: from,
          to: to,
          value: value.toString(),
          data: event,
        });
      });

      let txnData;

      await toast.promise(prm, {
        loading: 'Minting Token...',
        success: (data) => {
          txnData = data;
          return 'Token transferred successfully';
        },
        error: (err) => `Error: ${err}`,
      });

      console.log(txnData);
      const token_id = events[0].args.tokenId;
      const decoded_token_id = token_id.toNumber();
      console.log(decoded_token_id);
      console.log(txnData.transactionHash);
    } catch (error) {
      if (error.message.includes('Warranty: token is not out for sale')) {
        toast.error('Token is not out for sale');
      } else {
        toast.error('error');
      }
    }
  };

  const mintToken = async (to, metaHash, uri, days) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        Warranty.abi,
        signer
      );

      const txn = await contract.safeMint(to, metaHash, uri, days);
      const prm = txn.wait();

      let txnData;

      const filter = {
        address: contractAddress,
        topics: [
          ethers.utils.id(
            'WarrantyCardMinted(address, uint256, string, uint256)'
          ),
        ],
      };

      provider.on(filter, (log, event) => {
        console.log(log);
        console.log(event);
      });

      await toast.promise(prm, {
        loading: 'Minting Token...',
        success: (data) => {
          txnData = data;
          return 'Token minted successfully';
        },
        error: (err) => `Error: ${err}`,
      });

      console.log(txnData);
      console.log(txnData.transactionHash);
      const token_id = txnData.events[0].args.tokenId;
      const decoded_token_id = ethers.BigNumber.from(token_id).toNumber();
      console.log(decoded_token_id);
      return txnData;
    } catch (error) {
      if (error.message.includes('Warranty: already minted')) {
        toast.error('Warranty card already minter');

        transferTokenToNewUser(to);
      } else {
        toast.error('error');
        console.log(error);
      }
    }
  };

  return (
    <div className={styles.box}>
      <div className={styles.imgdiv}>
        <img src={tokenUri} className={styles.image} />
      </div>
      <div className={styles.content}>
        <div className={styles.realcontent}>
          <div className={styles.brand}>
            {/* <h5>Brand</h5> */}
            <div className={styles.verify}>
              <p>{brand} </p>
            </div>
          </div>
          <div className={styles.minter}>
            <h5>Product</h5>
            <div className={styles.verify}>
              <p>{name}</p>
            </div>
          </div>
          <div className={styles.owner}>
            <h5>Owner</h5>
            <p>{owner}</p>
          </div>
          <div className={styles.minter}>
            <h5>Sale date</h5>
            <div className={styles.verify}>
              <p>{saleDate}</p>
            </div>
          </div>

          <>
            {tab === 'Pending' && (
              <div className={styles.submit}>
                <button onClick={handleApproval}>Approve</button>
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
}

export default Approval;
