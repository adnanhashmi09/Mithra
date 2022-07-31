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
import { useStateContext } from '../../context/stateContext';
import { signOwnerMessage } from '../../lib/checkWeb3';

const Slug = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [warrantyLeft, setWarrantyLeft] = useState(0);

  const { brandAddress } = useStateContext();

  console.log(slug);

  const toggleClaim = async () => {
    try {
      if (brandAddress == '') {
        toast.error('Please connect with your wallet.');
        return;
      }
      const response = await signOwnerMessage(slug, brandAddress);
      const { signature, address: signedAddress } = response;
      console.log(response);

      const res = await fetch('http://localhost:5050/token/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verifyOwner: true,
          signature: signature,
          ethAddress: brandAddress,
          productId: slug,
          claim: !claimed,
        }),
      });

      if (!res.ok) {
        throw Error('Error!');
      }

      const data = await res.json();
      setClaimed(!claimed);
    } catch (error) {
      console.log(error);
      toast.error('Error!');
    }
  };

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
        // console.log(data);
        // console.log(product.transactions);
        setTransactions(data.transactions);
        setIsValid(true);

        const oneDay = 24 * 60 * 60 * 1000;
        const dateOne = new Date(data.mintedOn);
        const dateTwo = new Date();
        console.log(data.period);
        const diffTime = Math.floor(Math.abs(dateTwo - dateOne) / oneDay);
        console.log(diffTime);
        // if (data.period - diffTime > 0) {
        //   setWarrantyLeft(data.period - diffTime);
        // } else {
        //   setWarrantyLeft(0);
        // }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          data.contractAddress,
          Warranty.abi,
          provider
        );

        if (data.minter != '') {
          const checkWarranty = await contract.checkIfWarrantyIsOver(
            data.tokenId
          );
          const temp = ethers.BigNumber.from(checkWarranty).toNumber();
          console.log('check warranty', temp / (60 * 60 * 24));

          // round number to 1 decimal place
          const roundedData = Math.round((temp / (60 * 60 * 24)) * 10) / 10;

          setWarrantyLeft(roundedData);
        }
        console.log(data);

        if (data.tokenId) {
          const startTime = await contract.getStartTime(data.tokenId);
          console.log(
            'start time',
            ethers.BigNumber.from(startTime).toNumber()
          );
          const length = await contract.getWarrantyLength(data.tokenId);
          console.log('length time', ethers.BigNumber.from(length).toNumber());
          const blockTime = await contract.getBlockTimestamp();
          console.log(
            'block time',
            ethers.BigNumber.from(blockTime).toNumber()
          );
        }
        console.log('token id', product.tokenId);

        // const seconds = ethers.BigNumber.from(checkWarranty).toNumber();
        setClaimed(data.claim);
        // console.log(checkWarranty);
        // console.log(seconds / (24 * 60 * 60));
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
                  <h4>{warrantyLeft} day(s) left</h4>
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
                    <p>
                      {product.minter == ''
                        ? 'Warranty card not minted yet'
                        : product.brand}
                    </p>
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
                    onClick={() => {
                      toggleClaim();
                    }}
                    disabled={product.minter == '' ? true : false}
                    style={
                      product.minter == ''
                        ? {
                            display: 'none',
                            marginTop: '10px',
                            cursor: 'pointer',
                          }
                        : {
                            display: 'block',
                            marginTop: '10px',
                            cursor: 'pointer',
                          }
                    }
                  >
                    {claimed ? 'Resolve claim' : 'Claim warranty'}
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
                  {console.log(transactions)}

                  {transactions &&
                    transactions.map((txn, idx) => (
                      <div className={styles.table_row}>
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
                      </div>
                    ))}
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
