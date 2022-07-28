import Head from 'next/head';
import styles from '../../styles/Warranty.module.css';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Image from 'next/image';
import Arrow from '../../assets/Arrow 2.png';
import Footer from '../../components/Footer';

function warranty() {
  return (
    <>
      <Head>
        <title>मिthra</title>
        <meta name="description" content="Blockchain based warranties" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <Navbar underline="warranty" />
        <div className={styles.main}>
          <div className={styles.left}>
            <div className={styles.heading}>
              <h1>
                Check Your Product's Warranty Status ?
                <div className={styles.purple_box}></div>
              </h1>
            </div>
            <p>
              Fill the Following Form to check the status of your Product's
              Warranty Card using <span>NFT</span> technology.
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
              <p>My Warranties</p>
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
              <div className={styles.transaction_id}>
                <div className={styles.hashtag}>
                  <Image src="/hashtag.png" height="24px" width="24px"></Image>
                </div>
                <h3>Product ID</h3>
                <div className={styles.gradient}>
                  <input type="text" placeholder="XY82Y****************" />
                </div>
              </div>
              <br></br>
              <div className={styles.or_div}>
                <span className={styles.or}>
                  -------------- <span className={styles.orr}> OR </span>
                  --------------
                </span>
              </div>
              <div className={styles.your_name}>
                <div className={styles.hashtag}>
                  <Image src="/user.png" height="24px" width="24px"></Image>
                </div>
                <h3>Your Name</h3>
                <div className={styles.gradient}>
                  <input type="text" placeholder="John Doe" />
                </div>
              </div>
              <div className={styles.product_date}>
                <div className={styles.hashtag}>
                  <Image src="/calendar.png" height="24px" width="24px"></Image>
                </div>
                <h3>Date Of Purchase</h3>
                <div className={styles.gradient}>
                  <input type="text" placeholder="24 . 08 . 20XX" />
                </div>
              </div>
              <div className={styles.product_name}>
                <div className={styles.hashtag}>
                  <Image src="/product.png" height="22px" width="22px"></Image>
                </div>
                <h3>Product Name</h3>
                <div className={styles.gradient}>
                  <input type="text" placeholder="Nike Air Jordans Uni Blue" />
                </div>
              </div>

              <div className={styles.submit}>
                <button>Get Details</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default warranty;
