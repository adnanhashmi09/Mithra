import React, { useState } from 'react';
import styles from '../styles/Navbar.module.css';
import Link from 'next/link';
import Image from 'next/image';

import { useStateContext } from '../context/stateContext';
import { checkWeb3 } from '../lib/checkWeb3';

function Navbar(props) {
  const und = props.underline;

  const [isActive, setActive] = useState(false);

  const toggleClass = () => {
    setActive(!isActive);
  };

  const { brandAddress, setBrandAddress } = useStateContext();

  const handleConnect = async (e) => {
    e.preventDefault();
    const response = await checkWeb3();
    setBrandAddress(response.address);
    // console.log(brandAddress);
  };

  return (
    <>
      <div className={styles.father}>
        <div className={styles.main}>
          <Link href="/">
            <div className={styles.logo}>मिthra</div>
          </Link>

          <div className={styles.responsive}>
            <div
              className={`${styles.hamburger} ${
                isActive ? styles.isactive : ''
              } `}
              id={styles.hamboorger}
              onClick={toggleClass}
            >
              <span className={styles.line}></span>
              <span className={styles.line}></span>
              <span className={styles.line}></span>
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.navs}>
              <ul>
                {/* <Link href="/">
                  <li>
                    Home
                    {und === 'home' ? (
                      <div className={styles.underline}></div>
                    ) : (
                      ''
                    )}
                  </li>
                </Link> */}
                {/* <Link href="/shop">
                  <li>
                    Shop
                    {und === "shop" ? (
                      <div className={styles.underline}></div>
                    ) : (
                      ""
                    )}
                  </li>
                </Link> */}
                <Link href="/brand">
                  <li>
                    Brand
                    {und === 'brand' ? (
                      <div className={styles.underline}></div>
                    ) : (
                      ''
                    )}
                  </li>
                </Link>
                <Link href="/warranty">
                  <li>
                    Warranty{' '}
                    {und === 'warranty' ? (
                      <div className={styles.underline}></div>
                    ) : (
                      ''
                    )}
                  </li>
                </Link>
                {brandAddress != '' && (
                  <Link href="/brand/admin/dashboard">
                    <li>
                      Dashboard
                      {und === 'dashboard' ? (
                        <div className={styles.underline}></div>
                      ) : (
                        ''
                      )}
                    </li>
                  </Link>
                )}
              </ul>
            </div>
            {brandAddress == '' && (
              <div className={styles.search}>
                <button onClick={handleConnect}>Connect Wallet</button>
              </div>
            )}
          </div>
        </div>
        <div
          className={
            !isActive ? styles.responsive_details : styles.responsive_details_2
          }
        >
          <div className={styles.navs_resp}>
            <ul>
              <Link href="/">
                <li>
                  Home
                  {und === 'home' ? (
                    <div className={styles.underline}></div>
                  ) : (
                    ''
                  )}
                </li>
              </Link>
              {/* <Link href="/shop">
                <li>
                  Shop
                  {und === "shop" ? (
                    <div className={styles.underline}></div>
                  ) : (
                    ""
                  )}
                </li>
              </Link> */}
              <Link href="/brand">
                <li>
                  Brand{' '}
                  {und === 'brand' ? (
                    <div className={styles.underline}></div>
                  ) : (
                    ''
                  )}
                </li>
              </Link>
              <Link href="/warranty">
                <li>
                  Warranty
                  {und === 'warranty' ? (
                    <div className={styles.underline}></div>
                  ) : (
                    ''
                  )}
                </li>
              </Link>

              {brandAddress != '' && (
                <Link href="/brand/admin/dashboard">
                  <li>
                    Dashboard
                    {und === 'dashboard' ? (
                      <div className={styles.underline}></div>
                    ) : (
                      ''
                    )}
                  </li>
                </Link>
              )}
              {brandAddress == '' && (
                <li>
                  <div className={styles.search}>
                    <button>Connect Wallet</button>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
