import React, { useEffect, useLayoutEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import styles from '../../../styles/Dashboard.module.css';
import Image from 'next/image';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import Approval from '../../../components/Approval';
import Head from 'next/head';

import { useStateContext } from '../../../context/stateContext';
import { checkWeb3, signMessage } from '../../../lib/checkWeb3';
import toast from 'react-hot-toast';

function Admin() {
  const [tab, setTab] = useState('Pending');
  const [valid, setValid] = useState(false);
  const [products, setProducts] = useState({ Approved: [], Pending: [] });
  const [brand, setBrand] = useState('');
  const handleSelect = (e) => {
    setTab(e.target.value);
  };
  const { brandAddress, setBrandAddress } = useStateContext();
  useEffect(() => {
    // console.log('I ran');

    // return;
    (async () => {
      if (brandAddress !== '') {
        const response = await signMessage(brandAddress);

        console.log(response.error);
        if (response.error) {
          toast.error(
            'Signature not valid. Please connect with your wallet and reload.'
          );
        }

        const res = await fetch('http://localhost:5050/token/all', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ethAddress: response.address,
            signature: response.signature,
          }),
        });

        const data = await res.json();
        const { tokens, brand: brandName } = data;
        setBrand(brandName);
        setValid(true);
        setProducts({ Approved: tokens.approved, Pending: tokens.unapproved });
        console.log(data);
      }
    })();
  }, [brandAddress]);

  return (
    <>
      <Head>
        <title>मिthra</title>
        <meta name="description" content="Blockchain based warranties" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <Navbar underline="dashboard" />
        {brandAddress === '' && (
          <>
            <h1 style={{ textAlign: 'center', marginTop: '10rem' }}>
              Please connect to your wallet
            </h1>
          </>
        )}

        {brandAddress !== '' && (
          <div className={styles.main}>
            <h1>
              <span>{brand}</span> Admin Dashboard
            </h1>
            <div className={styles.tabs}>
              <div
                onClick={(e) => {
                  setTab('Approved');
                }}
                className={`${styles.tab} ${
                  tab == 'Approved' ? styles.active : ''
                }`}
              >
                Approved
              </div>
              <div
                onClick={(e) => {
                  setTab('Pending');
                }}
                className={`${styles.tab} ${
                  tab == 'Pending' ? styles.active : ''
                }`}
              >
                Pending
              </div>
            </div>

            {valid && (
              <div className={styles.cardContainer}>
                {Array.from(products[tab]).map((e, index) => (
                  <Approval
                    {...e}
                    tab={tab}
                    brandAddress={brandAddress}
                    key={`approvals ${index}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Admin;
