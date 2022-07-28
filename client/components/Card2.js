import React from "react";
import styles from "../styles/Card2.module.css";
import Link from "next/link";
import Image from "next/image";

function Card({ name, price, url, desc, volume }) {
  return (
    <div className={styles.card}>
      <div className={styles.card_img}>
        <Image width={200} height={200} src={`/images/${url}`} alt="..." />
      </div>
      <div className={styles.card_title}>
        <h3>{name}</h3>
        <p>{desc}</p>
      </div>
      <div className={styles.card_details}>
        <div className={styles.price}>
          <span>Price</span>
          <p>${price}</p>
        </div>
        <div className={styles.volume}>
          <span>Item Volume</span>
          <p>{volume}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
