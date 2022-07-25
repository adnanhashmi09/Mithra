import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import styles from "../../../styles/BrandLogin.module.css";
import Image from "next/image";
import Footer from "../../../components/Footer";
import Link from "next/link";
function admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    console.log(email, password);

    e.preventDefault();
  };

  return (
    <>
      <div className={styles.container}>
        <Navbar underline="brand" />
        <div className={styles.main}>
          <div className={styles.right}>
            <h1>Brand Login</h1>
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
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
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.product_name}>
                <div className={styles.hashtag}>
                  <Image src="/product.png" height="22px" width="22px"></Image>
                </div>
                <h3>Password</h3>
                <div className={styles.gradient}>
                  <input
                    type="password"
                    placeholder="***********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.submit}>
                <button type="submit">Login</button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default admin;
