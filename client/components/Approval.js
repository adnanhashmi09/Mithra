import React from 'react';
import styles from '../styles/Approval.module.css';
import Link from 'next/link';
import Image from 'next/image';

function Approval({ minter, owner, image, price, tab }) {
  return (
    <div className={styles.box}>
      <div className={styles.imgdiv}>
        <img src={image} height={240} width={180} className={styles.image} />
      </div>
      <div className={styles.content}>
        <div className={styles.realcontent}>
          <div className={styles.minter}>
            <h5>Minter</h5>
            <div className={styles.verify}>
              <p>{minter}</p>
            </div>
          </div>
          <div className={styles.owner}>
            <h5>Owner</h5>
            <p>{owner}</p>
          </div>
          <div className={styles.price}>
            <h5>{price}</h5>
            <p>$120.78</p>
          </div>
        </div>
        <div className={styles.buttonflex}>
          {tab === 'Pending' && (
            <div className={styles.submit}>
              <button>Approve</button>
            </div>
          )}
          {/* <div className={styles.submit}>
            <button>Decline</button>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Approval;
