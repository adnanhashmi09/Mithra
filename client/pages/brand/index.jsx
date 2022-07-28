import React from 'react';
import Navbar from '../../components/Navbar';
import styles from '../../styles/Brand.module.css';
import Image from 'next/image';
import Footer from '../../components/Footer';
import Link from 'next/link';
import Head from 'next/head';
function brand() {
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
          <div className={styles.left}>
            <div className={styles.heading}>
              <h1>
                Register & Deploy a contract with us !!
                <div className={styles.purple_box}></div>
              </h1>
            </div>
            <p>
              Register your Brand here to gain <span>Admin</span> Access to your
              Minted NFTs.
            </p>
            <div className={styles.my_warranty}>
              <div className={styles.ellipse}>
                <Image
                  src="/Ellipse 2.png"
                  height={35}
                  width={35}
                  alt="Circle"
                />
              </div>
              <Link href="/brand/admin">
                <p>Login</p>
              </Link>
              <div className={styles.arrow}>
                <Image
                  src="/Arrow 2.png"
                  height="10px"
                  width="60px"
                  alt="Arrow"
                />
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <form>
              <div className={styles.your_name}>
                <div className={styles.hashtag}>
                  <Image src="/user.png" height="24px" width="24px"></Image>
                </div>
                <h3>Brand Name</h3>
                <div className={styles.gradient}>
                  <input type="text" placeholder="Nike Shoes Co." />
                </div>
              </div>
              <div className={styles.product_name}>
                <div className={styles.hashtag}>
                  <Image src="/calendar.png" height="24px" width="24px"></Image>
                </div>
                <h3>Token Name</h3>
                <div className={styles.gradient}>
                  <input type="text" placeholder="NIKE" />
                </div>
              </div>
              <div className={styles.product_name}>
                <div className={styles.hashtag}>
                  <Image src="/product.png" height="22px" width="22px"></Image>
                </div>
                <h3>Token Symbol</h3>
                <div className={styles.gradient}>
                  <input type="text" placeholder="NKE" />
                </div>
              </div>
              <div className={styles.product_date}>
                <div className={styles.hashtag}>
                  <Image src="/calendar.png" height="24px" width="24px"></Image>
                </div>
                <h3>Email Address</h3>
                <div className={styles.gradient}>
                  <input type="email" placeholder="mybrand@domain.com" />
                </div>
              </div>
              {/* <div className={styles.product_name}>
                <div className={styles.hashtag}>
                  <Image src="/product.png" height="22px" width="22px"></Image>
                </div>
                <h3>Password</h3>
                <div className={styles.gradient}>
                  <input type="text" placeholder="***********" />
                </div>
              </div> */}

              <div className={styles.submit}>
                <button>Register</button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default brand;
