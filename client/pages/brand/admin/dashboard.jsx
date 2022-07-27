import React from "react";
import Navbar from "../../../components/Navbar";
import styles from "../../../styles/Dashboard.module.css";
import Image from "next/image";
import Footer from "../../../components/Footer";
import Link from "next/link";
import Approval from "../../../components/Approval";
function admin() {
  return (
    <>
      <div className={styles.container}>
        <Navbar underline="brand" />
        <div className={styles.main}>
          <h1>Admin Dashboard</h1>
          <h4>Pending Requests</h4>
          <Approval></Approval>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default admin;