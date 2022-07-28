import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';
import styles from '../../../styles/Dashboard.module.css';
import Image from 'next/image';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import Approval from '../../../components/Approval';
import Head from 'next/head';
function Admin() {
  const [tab, setTab] = useState('Pending');

  const handleSelect = (e) => {
    setTab(e.target.value);
  };

  const data = {
    Approved: [
      {
        minter: 'Nike Shoes Co.',
        owner: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        price: '$120.78',
        image: '/nft.jpeg',
      },
      {
        minter: 'Adidas Shoes Co.',
        owner: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        price: '$120.78',
        image: '/nft.jpeg',
      },
      {
        minter: 'Nivia Shoes Co.',
        owner: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        price: '$120.78',
        image: '/nft.jpeg',
      },
      {
        minter: 'Zara Shoes Co.',
        owner: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        price: '$120.78',
        image: '/nft.jpeg',
      },
    ],
    Pending: [
      {
        minter: 'Nike Shoes Co.',
        owner: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        price: '$120.78',
        image: '/nft.jpeg',
      },
      {
        minter: 'Adidas Shoes Co.',
        owner: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        price: '$120.78',
        image: '/nft.jpeg',
      },
    ],
  };
  return (
    <>
      <Head>
        <title>मिthra</title>
        <meta name="description" content="Blockchain based warranties" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <Navbar underline="brand" />
        <div className={styles.main}>
          <h1>Admin Dashboard</h1>
          <div className={styles['select-dropdown']}>
            <select
              onChange={(e) => {
                handleSelect(e);
              }}
              value={tab}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
            </select>
          </div>
          {data[tab].map((e, index) => (
            <Approval {...e} tab={tab} key={`approvals ${index}`} />
          ))}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Admin;
