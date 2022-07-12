import React from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/Warranty.module.css";

function marketplace() {
  return (
    <>
      <div className={styles.container}>
        <Navbar underline="marketplace" />
      </div>
    </>
  );
}

export default marketplace;
