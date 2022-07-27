import Head from "next/head";
import styles from "../../styles/Shop.module.css";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Card2 from "../../components/Card2";

function warranty() {
  return (
    <>
      <div className={styles.containers}>
        <Navbar underline="shop" />
        <div className={styles.checkout_main}>
          <div className={styles.checkout_left}>
            <Card2
              name="AJ 1 Uni Blue"
              price="2000"
              url="aj1.png"
              desc="Sneakers"
              volume="1 Pair"
            />
          </div>

          <div className={styles.right}>
            <form>
              <div className={styles.your_name}>
                <div className={styles.hashtag}>
                  <Image src="/user.png" height="24px" width="24px"></Image>
                </div>
                <h3> Name</h3>
                <div className={styles.gradient}>
                  <input type="text" placeholder="Dhruv Deora" />
                </div>
              </div>
              <div className={styles.product_date}>
                <div className={styles.hashtag}>
                  <Image src="/calendar.png" height="24px" width="24px"></Image>
                </div>
                <h3> Address</h3>
                <div className={styles.gradient}>
                  <input type="text" placeholder="ABC Street, C city" />
                </div>
              </div>
              <div className={styles.product_name}>
                <div className={styles.hashtag}>
                  <Image src="/product.png" height="22px" width="22px"></Image>
                </div>
                <h3>Payment Method</h3>
                <div className={styles.gradient}>
                  <input type="text" placeholder="Cash" />
                </div>
              </div>

              <div className={styles.submit}>
                <button>Checkout</button>
              </div>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default warranty;
