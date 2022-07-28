import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>मिthra</title>
        <meta name="description" content="Blockchain based warranties" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar underline="home" />
      <Footer />
    </div>
  );
}
