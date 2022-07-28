import Head from "next/head";
import styles from "../../styles/Shop.module.css";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Card from "../../components/Card";

function warranty() {
  return (
    <>
      {/* <div className={styles.container}>
        <Navbar underline="shop" />
      </div> */}
      <div className={styles.containers}>
        <Navbar underline="shop" />

        <div className={styles.herobanner}>
          <div className={styles.hero_left}>
            <h3>Air Jordans 1 Univerity Blue</h3>
            <h2>SUMMER BONZANA</h2>
            <h1>SALE</h1>
            <div className={styles.shop_button}>
              <button> Shop Now</button>
            </div>
          </div>
          <div className={styles.hero_right}>
            <Image src="/aj1.png" height={480} width={480}></Image>
          </div>
        </div>
        <div className={styles.prod_display}>
          <h1> Today's Special Sale</h1>
          <div className={styles.card_grid}>
            <div className={styles.eachcard}>
              <Card
                name="Versace Eros"
                price="139"
                url="01.png"
                desc="Eau de Toilette"
                volume="150ml"
              />
            </div>
            <div className={styles.eachcard}>
              <Card
                name="Dior Sauvage"
                price="99"
                url="02.png"
                volume="100ml"
                desc="Eau de Parfum"
              />
            </div>
            <div className={styles.eachcard}>
             
              <Card
                name="AJ 1 Uni Blue"
                price="2000"
                url="aj1.png"
                desc="Sneakers"
                volume="1 Pair"
              />
       
            </div>
            <div className={styles.eachcard}>
              <Card
                name="Chanel Coco"
                price="190"
                url="04.png"
                desc="Eau de Toilette"
                volume="100ml"
              />{" "}
            </div>
          </div>
        </div>
        <div className={styles.herobanner}>
          <div className={styles.hero_left}>
            <h3>Air Jordans 1 Univerity Blue</h3>
            <h2>SUMMER BONZANA</h2>
            <h1>SALE</h1>
            <div className={styles.shop_button}>
              <button> Shop Now</button>
            </div>
          </div>
          <div className={styles.hero_right}>
            <Image src="/aj1.png" height={480} width={480}></Image>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default warranty;
