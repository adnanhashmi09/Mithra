// Mock Review Comment
import React from 'react';

// function [slug]() {
//   return (
//     <div>[slug]</div>
//   )
// }

// export default [slug]

import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import styles from '../../styles/Nftpage.module.css';

import Footer from '../../components/Footer';
import Image from 'next/image';
import Head from 'next/head';

const Slug = () => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <>
      <Head>
        <title>मिthra</title>
        <meta name="description" content="Blockchain based warranties" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <Navbar underline="warranty" />
        <div className={styles.main_div}>
          <div className={styles.image_left}>
            <Image
              src="/nft.jpeg"
              height="400px"
              width="300px"
              className={styles.image_left_1}
            ></Image>
            <div className={styles.below_image}>
              <h4>21 days left</h4>
              <div className={styles.time}>
                <Image
                  src="/time.png"
                  height="10px"
                  width="10px"
                  className={styles.image_clock}
                ></Image>
              </div>
            </div>
          </div>

          <div className={styles.content}>
            <h1>NIKE AIR JORDANS #1920</h1>
            <div className={styles.minter}>
              <h5>Minter</h5>
              <div className={styles.verify}>
                <p>Nike Shoes Co.</p>
              </div>
            </div>
            <div className={styles.owner}>
              <h5>Owner</h5>
              <p>Mr. Dhruv Deora</p>
            </div>
            <div className={styles.price}>
              <h5>Price</h5>
              <p>$120.78</p>
            </div>
            <div className={styles.desc}>
              <h5>Description</h5>
              <p>
                A formal sneaker that is in collaboration with Travis Scott and
                Dior to make the best combo that us possiible in the history if
                mankind
              </p>
            </div>
            {/* <div className={styles.lesgo}>
              <div className={styles.submit}>
                <button>Claim Warranty</button>
              </div>
              <div className={styles.submit}>
                <button>Transaction History</button>
              </div>
            </div> */}
          </div>
        </div>
        <div className={styles.main_table}>
          <div className={styles.table}>
            <div className={styles.table_header}>
              <div className={styles.header__item}>Name</div>
              <div className={styles.header__item}>Wins</div>
              <div className={styles.header__item}>Draws</div>
              <div className={styles.header__item}>Losses</div>
              <div className={styles.header__item}>Total</div>
            </div>
            <div className={styles.table_content}>
              <div className={styles.table_row}>
                <div className={styles.table_data}>Tom</div>
                <div className={styles.table_data}>2</div>
                <div className={styles.table_data}>0</div>
                <div className={styles.table_data}>1</div>
                <div className={styles.table_data}>5</div>
              </div>
              <div className={styles.table_row}>
                <div className={styles.table_data}>Dick</div>
                <div className={styles.table_data}>1</div>
                <div className={styles.table_data}>1</div>
                <div className={styles.table_data}>2</div>
                <div className={styles.table_data}>3</div>
              </div>
              <div className={styles.table_row}>
                <div className={styles.table_data}>Harry</div>
                <div className={styles.table_data}>0</div>
                <div className={styles.table_data}>2</div>
                <div className={styles.table_data}>2</div>
                <div className={styles.table_data}>2</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Slug;
