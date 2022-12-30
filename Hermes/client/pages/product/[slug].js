import React, { useEffect, useState } from "react";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";

import { client, urlFor } from "../../lib/client";
import { Product } from "../../components";
import toast from "react-hot-toast";
import getStripe from "../../lib/getStripe";
import { useStateContext } from "../../context/StateContext";
import useCheckWeb3Support from "../../hooks/checkWeb3Support";

import { signMessage } from "../../lib/signMessage";
import { ethers } from "ethers";

const styles = {
  position: "absolute",
  top: "90%",
  left: "80%",
  transform: "rotate(-0deg) translate(-50%, -50%)",
  fontWeight: "bold",
  fontSize: "50px",
  color: "#c50f0f",
  display: "block",
};

const ProductDetails = ({ product, products }) => {
  const { image, name, details, price, sold } = product;
  const [index, setIndex] = useState(0);
  const [email, setEmail] = useState("");
  const { qty, address } = useStateContext();

  console.log(sold);

  useCheckWeb3Support();
  const productSold = async () => {
    return client
      .patch(product._id)
      .set({ sold: true, owner: address })
      .commit();
  };

  function randomStringGenerator(strLength, charSet) {
    var result = [];

    strLength = strLength || 5;
    charSet =
      charSet ||
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    while (strLength--) {
      // (note, fixed typo)
      result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
    }

    return result.join("");
  }

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const gasPrice = provider.getGasPrice();
  });

  const initApproval = async (emailAddress, product) => {
    const img = product.image[0].asset._ref;
    const newImage = img
      .replace("image-", "https://cdn.sanity.io/images/50pnuw2c/production/")
      .replace("-webp", ".webp");

    const today = new Date();
    const date = String(
      `${today.getDate()}.${String(today.getMonth() + 1).padStart(
        2,
        "0"
      )}.${today.getFullYear()}`
    );

    const randomString = randomStringGenerator(20);

    const body = {
      name: product.name,
      owner: product.owner,
      productId: product._id,
      brand: product.brand,
      contractAddress: product.contractAddress,
      brandAddress: product.brandAddress,
      tokenUri: newImage,
      period: product.warrantyPeriod,
      description: product.details,
      email: emailAddress,
      saleDate: date,
      approval: {
        event: "transfer",
        date: date,
        from: product.owner,
        to: address,
        email: email,
        txnId: randomString,
      },
    };

    console.log(body);

    const resp = await fetch("http://20.198.2.124:5050/token/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    console.log(resp);
  };

  const handleBuyNow = async () => {
    if (address === "") {
      toast.error("please connect to metamask");
      return;
    }

    console.log(product);

    const prm = signMessage(address);

    await toast.promise(prm, {
      loading: "Loading...",
      success: (data) => {
        return "Transaction signed successfully";
      },
      error: "Transaction failed",
    });

    const sanityPromise = productSold();

    await toast.promise(sanityPromise, {
      loading: "Initiating Transaction...",
      success: "Transaction initiated successfully",
      error: " Transaction failed",
    });
    initApproval(email, product);

    // const stripe = await getStripe();
    // const gas = 70;
    // const response = await fetch('/api/stripe', {
    // method: 'POST',
    // headers: {
    // 'Content-Type': 'application/json',
    // },
    // body: JSON.stringify([{ product, qty, gas }]),
    // });

    // if (response.statusCode === 500) return;

    // const data = await response.json();

    // toast.loading('Redirecting...');

    // stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div>
      <div className="product-detail-container">
        <div className={`leftImages ${sold ? "sold" : ""}`}>
          <div className="image-container">
            <img
              src={urlFor(image && image[index])}
              className="product-detail-image"
            />
            <span style={sold ? styles : { display: "none" }}>SOLD</span>
          </div>
          <div className="small-images-container">
            {image?.map((item, i) => (
              <img
                key={i}
                src={urlFor(item)}
                className={
                  i === index ? "small-image selected-image" : "small-image"
                }
                onMouseEnter={() => setIndex(i)}
              />
            ))}
          </div>
        </div>

        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <h4>Details: </h4>
          <p>{details}</p>
          <p className="price">
            ₹ {price}{" "}
            <span
              style={{
                fontSize: "1rem",
                color: "black",
              }}
            >
              (exclusive of warranty charges)
            </span>
          </p>

          <div
            className="buttons"
            style={sold ? { opacity: 0.3, pointerEvents: "none" } : {}}
          >
            <input
              type="text"
              className="input-email"
              placeholder="Email: you will be notified here when the warranty starts"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <button type="button" className="buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths = async () => {
  const query = `*[_type == "product"] {
    slug {
      current
    }
  }
  `;

  const products = await client.fetch(query);

  const paths = products.map((product) => ({
    params: {
      slug: product.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const productsQuery = '*[_type == "product"]';

  const product = await client.fetch(query);
  const products = await client.fetch(productsQuery);

  console.log(product);

  return {
    props: { products, product },
  };
};

export default ProductDetails;
