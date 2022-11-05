import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import styles from '../../styles/Brand.module.css';
import Image from 'next/image';
import Footer from '../../components/Footer';
import Link from 'next/link';
import Head from 'next/head';
import deployContract from '../../lib/deploy';
import { ethers } from 'ethers';
import Warranty from '../../abi/Warranty.sol/Warranty.json';

import toast from 'react-hot-toast';

// 0x73eD400D15d4271F653C9de252125A158e5Fbded

function brand() {
  let WarrantyContract;

  // useEffect(() => {
  //   async function foo() {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const contract = new ethers.Contract(
  //       '0x73eD400D15d4271F653C9de252125A158e5Fbded',
  //       Warranty.abi,
  //       provider
  //     );

  //     const symbol = await contract.symbol();
  //     console.log(symbol);
  //   }

  //   foo();
  // });

  const [brandName, setBrandName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [email, setEmail] = useState('');

  const deploy = async (e) => {
    e.preventDefault();
    const myPromise = deployContract(tokenName, tokenSymbol);

    let address;
    let WarrantyContract;

    await toast.promise(myPromise, {
      loading: 'Loading',
      success: (data) => {
        WarrantyContract = data.contract;
        address = data.address;
        return `Successfully deployed ${data.contract.address}`;
      },
      error: 'Error when fetching',
    });

    // const { contract: WarrantyContract, address } = data;
    console.log(WarrantyContract);
    // const provider = new ethers.providers.Web3Provider(window.ethereum);

    const symbol = await WarrantyContract.symbol();

    //TODO: add a toast message

    const response = await fetch(
      `http://localhost:5050/brand/init/${address}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ethAddress: address,
          name: brandName,
          email,
          tokenSymbol,
          tokenName,
          contractAddress: WarrantyContract.address,
        }),
      }
    );

    console.log(response);
    console.log(symbol);

    setBrandName('');
    setTokenName('');
    setTokenName('');
    setEmail('');
  };

  // useEffect(() => {
  //   toast.success('Brand created successfully!');
  // }, []);

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
            <form
              onSubmit={(e) => {
                deploy(e);
              }}
            >
              <div className={styles.your_name}>
                <div className={styles.hashtag}>
                  <Image src="/user.png" height="24px" width="24px"></Image>
                </div>
                <h3>Brand Name</h3>
                <div className={styles.gradient}>
                  <input
                    type="text"
                    placeholder="Nike Shoes Co."
                    value={brandName}
                    onChange={(e) => {
                      setBrandName(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className={styles.product_name}>
                <div className={styles.hashtag}>
                  <Image src="/calendar.png" height="24px" width="24px"></Image>
                </div>
                <h3>Token Name</h3>
                <div className={styles.gradient}>
                  <input
                    type="text"
                    placeholder="NIKE"
                    value={tokenName}
                    onChange={(e) => {
                      setTokenName(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className={styles.product_name}>
                <div className={styles.hashtag}>
                  <Image src="/product.png" height="22px" width="22px"></Image>
                </div>
                <h3>Token Symbol</h3>
                <div className={styles.gradient}>
                  <input
                    type="text"
                    placeholder="NKE"
                    value={tokenSymbol}
                    onChange={(e) => {
                      setTokenSymbol(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className={styles.product_date}>
                <div className={styles.hashtag}>
                  <Image src="/calendar.png" height="24px" width="24px"></Image>
                </div>
                <h3>Email Address</h3>
                <div className={styles.gradient}>
                  <input
                    type="email"
                    placeholder="mybrand@domain.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
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
