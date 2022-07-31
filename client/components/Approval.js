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
  email,
  tokenId,
  claim,
  setReload,
  reload,
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

    // const date1 = new Date();
    // const today = date1.setFullYear(date1.getFullYear() + 0);
    // const date2 = date1.setFullYear(date1.getFullYear() + data.response.period);
    // const diffTime = Math.abs(date2 - today);
    // const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    try {
      const transaction = await mintToken(
        data.response.approval.to,
        data.response.metaHash,
        data.response.tokenUri,
        data.response.period
      ); // get a txnHash here
      // transaction = { txnHash: 'ahsdhasd' };

      const approval = data.response.approval;
      approval.txnHash = transaction.txnHash;
      response = await signMessage(brandAddress);

      console.log(response.error);
      if (response.error) {
        toast.error(
          'Signature not valid. Please connect with your wallet and reload.'
        );
      }

      console.log(response);

      const txnRsp = await fetch('http://localhost:5050/token/approve/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Approval: approval,
          productId: productId,
          ethAddress: response.address,
          signature: response.signature,
          tokenId: transaction.decoded_token_id,
        }),
      });
      const dat = await txnRsp.json();
      console.log(dat);
      // setReload(!reload);
    } catch (error) {
      toast.error('error');
      console.log(error);
    }
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
        loading: 'Transferring token',
        success: (data) => {
          txnData = data;
          return 'Token transferred successfully';
        },
        error: (err) => `Error: ${err}`,
      });

      // const token_id = events[0].args.tokenId;
      // const decoded_token_id = token_id.toNumber();
      // console.log(decoded_token_id);
      // console.log(txnData.transactionHash);

      console.log(txnData);

      return new Promise((resolve, reject) => {
        resolve({
          txnHash: txnData.transactionHash,
          decoded_token_id: 0,
        });
      });
    } catch (error) {
      if (error.message.includes('Warranty: token is not out for sale')) {
        toast.error('Token is not out for sale');
      } else {
        toast.error('error in transfer token');
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
      return new Promise((resolve, reject) => {
        resolve({ decoded_token_id, txnHash: txnData.transactionHash });
      });
    } catch (error) {
      if (error.message.includes('Warranty: already minted')) {
        toast('Token seems to be already minted\nTrying transfer.')

        const transaction = await transferTokenToNewUser(to);
        return new Promise((resolve, reject) => {
          resolve(transaction);
        });
      } else {
        toast.error('error in mint token');
        console.log(error);
      }
    }
  };

  return (
    <div className={`${styles.box} ${claim ? styles.claimed : ''}`}>
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

          <div className={`${styles.warranty} ${claim ? styles.claimed : ''}`}>
            <h5 style={{ color: '#ff48fa' }}>Warranty Claimed: </h5>
            <a href={`mailto:${email}`}>{email}</a>
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
