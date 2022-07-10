import React, { useState } from "react";
import styles from "../styles/Navbar.module.css";
import Link from "next/link";
import Image from "next/image";

function Navbar(props) {
  const und = props.underline;

  const [isActive, setActive] = useState(false);

  const toggleClass = () => {
    setActive(!isActive);
  };

  return (
    <>
      <div className={styles.father}>
        <div className={styles.main}>
          <Link href="/">
            <div className={styles.logo}>NFTkart</div>
          </Link>

          <div className={styles.responsive}>
            <div
              className={`${styles.hamburger} ${
                isActive ? styles.isactive : ""
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
                <Link href="/">
                  <li>
                    Home
                    {und === "home" ? (
                      <div className={styles.underline}></div>
                    ) : (
                      ""
                    )}
                  </li>
                </Link>
                <Link href="/marketplace">
                  <li>
                    MarketPlace{" "}
                    {und === "marketplace" ? (
                      <div className={styles.underline}></div>
                    ) : (
                      ""
                    )}
                  </li>
                </Link>
                <Link href="/warranty">
                  <li>
                    Warranty{" "}
                    {und === "warranty" ? (
                      <div className={styles.underline}></div>
                    ) : (
                      ""
                    )}
                  </li>
                </Link>
              </ul>
            </div>
            <div className={styles.search}>
              <div className={styles.search_image}>
                <Image src="/search.jpeg" width={18} height={18}></Image>
              </div>
              <button>Connect Wallet</button>
            </div>
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
                  {und === "home" ? (
                    <div className={styles.underline}></div>
                  ) : (
                    ""
                  )}
                </li>
              </Link>
              <Link href="/marketplace">
                <li>
                  MarketPlace{" "}
                  {und === "marketplace" ? (
                    <div className={styles.underline}></div>
                  ) : (
                    ""
                  )}
                </li>
              </Link>
              <Link href="/warranty">
                <li>
                  Warranty
                  {und === "warranty" ? (
                    <div className={styles.underline}></div>
                  ) : (
                    ""
                  )}
                </li>
              </Link>
              <li>
                <div className={styles.search}>
                  <button>Connect Wallet</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
