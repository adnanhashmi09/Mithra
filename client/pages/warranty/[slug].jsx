// Mock Review Comment
import React, { useEffect, useLayoutEffect, useState } from 'react';

// function [slug]() {
//   return (
//     <div>[slug]</div>
//   )
// }

// export default [slug]
import { toast } from 'react-hot-toast';

import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import styles from '../../styles/Nftpage.module.css';

import Footer from '../../components/Footer';
import Image from 'next/image';
import Head from 'next/head';

import { ethers } from 'ethers';
import Warranty from '../../../blockchain/artifacts/contracts/Warranty.sol/Warranty.json';

const Slug = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [isValid, setIsValid] = useState(false);
  console.log(slug);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const response = await fetch('http://localhost:5050/token/single', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId: slug }),
        });

        const data = await response.json();
        setProduct(data);
        console.log(data);
        console.log(product.transactions);
        setTransactions(data.transactions);
        setIsValid(true);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          data.contractAddress,
          Warranty.abi,
          provider
        );

        const checkWarranty = await contract.checkIfWarrantyIsOver(2);

        const seconds = ethers.BigNumber.from(checkWarranty).toNumber();
        console.log(checkWarranty);
        console.log(seconds / (24 * 60 * 60));
      } catch (error) {
        setIsValid(false);
        console.log(error);
        toast.error('Invalid product Id', { duration: 800 });
        toast.loading('Redirecting...', { duration: 1000 });
        setTimeout(() => {
          router.push('/warranty');
        }, 1500);
      }
    })();
  }, [slug]);

  return (
    <>
      <Head>
        <title>मिthra</title>
        <meta name="description" content="Blockchain based warranties" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <Navbar underline="warranty" />
        {isValid && (
          <>
            <div className={styles.main_div}>
              <div className={styles.image_left}>
                <img
                  src={product.tokenUri}
                  height="400px"
                  width="300px"
                  className={styles.image_left_1}
                />
                <div className={styles.below_image}>
                  <h4>21 days left</h4>
                  <div className={styles.time}>
                    <Image
                      src="/time.png"
                      height="15px"
                      width="15px"
                      className={styles.image_clock}
                    ></Image>
                  </div>
                </div>
              </div>

              <div className={styles.content}>
                <h1>{product.name}</h1>
                <div className={styles.minter}>
                  <h5>Minter</h5>
                  <div className={styles.verify}>
                    <p>{product.brand}</p>
                  </div>
                </div>
                <div className={styles.owner}>
                  <h5>Owner</h5>
                  <p>{product.owner}</p>
                </div>
                <div className={styles.price}>
                  <h5>Latest Sale</h5>
                  <p>{product.saleDate}</p>
                </div>
                <div className={styles.desc}>
                  <h5>Description</h5>
                  <p>{product.description}</p>
                </div>
                <div className={styles.submit}>
                  <button
                    style={{ marginTop: '10px', cursor: 'pointer' }}
                    onClick={() => {}}
                  >
                    Claim warranty
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.main_table}>
              <div className={styles.table}>
                <div className={styles.table_header}>
                  <div className={styles.header__item}>Event</div>
                  <div className={styles.header__item}>From</div>
                  <div className={styles.header__item}>To</div>
                  <div className={styles.header__item}>Transaction Hash</div>
                  <div className={styles.header__item}>Date</div>
                </div>
                <div className={styles.table_content}>
                  <div className={styles.table_row}>
                    {console.log(transactions)}

                    {transactions.map((txn, idx) => (
                      <>
                        <div className={styles.table_data}>{txn.event}</div>
                        <div className={styles.table_data}>{txn.from}</div>
                        <div className={styles.table_data}>{txn.to}</div>
                        <div className={styles.table_data}>
                          <a
                            href={`https://mumbai.polygonscan.com/tx/${txn.txnHash}`}
                          >
                            {txn.txnHash}
                          </a>
                        </div>
                        <div className={styles.table_data}>{txn.date}</div>
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Slug;
