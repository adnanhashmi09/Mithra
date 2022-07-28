import React from 'react';
import Navbar from '../../../components/Navbar';
import styles from '../../../styles/Dashboard.module.css';
import Image from 'next/image';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import Approval from '../../../components/Approval';
import Head from 'next/head';
function admin() {
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
          <h4>Pending Requests</h4>
          <Approval></Approval>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default admin;
