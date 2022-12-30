import React, { useEffect, useState } from "react";
import Link from "next/link";

import { client, urlFor } from "../lib/client";
import { useStateContext } from "../context/StateContext";
import toast from "react-hot-toast";

import { signMessage } from "../lib/signMessage";

import { ethers } from "ethers";
import Warranty from "../contract/Warranty.json";

const UserProduct = ({
  product: { image, name, contractAddress, price, _id },
  setReload,
  reload,
  mongoData,
}) => {
  const { qty, address } = useStateContext();
  const [isUnapproved, setIsUnapproved] = useState(false);
  const [token, setToken] = useState({});

  const productSold = async () => {
    return client.patch(_id).set({ sold: false }).commit();
  };

  const toggleSale = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        Warranty.abi,
        signer
      );
      console.log(token);
      const txn = await contract.listForSale(token.tokenId);
      const prm = txn.wait();

      let txnData;

      await toast.promise(prm, {
        loading: "Putting up token for sale...",
        success: (data) => {
          txnData = data;
          return "Token listed successfully";
        },
        error: (err) => `Error: ${err}`,
      });

      console.log(txnData);
      return { txnData, error: null };
    } catch (error) {
      toast.error("error");
      console.log(error);
      return { txnData: null, error };
    }
  };

  const handleResale = async () => {
    // const prm = signMessage(address);

    try {
      const { txnData, error } = await toggleSale();
      if (error) throw Error(error);

      const myPromise = productSold();
      await toast.promise(myPromise, {
        loading: "Listing in the market...",
        success: "Listed successfully",
        error: "Error ",
      });
      setReload(!reload);
    } catch (error) {
      toast.error("error");
      console.log(error);
    }

    // await toast.promise(prm, {
    //   loading: 'Loading...',
    //   success: (data) => {
    //     return 'Transaction signed successfully';
    //   },
    //   error: 'Transaction failed',
    // });
  };

  useEffect(() => {
    if (!mongoData.unapproved || !mongoData.approved) return;
    for (const el of mongoData.unapproved) {
      console.log(el.productId);
      if (el.productId === _id) {
        console.log("found");
        console.log(el);
        setToken(el);
        setIsUnapproved(true);
        break;
      }
    }

    for (const el of mongoData.approved) {
      console.log(el.productId);
      if (el.productId === _id) {
        console.log("found");
        console.log(el);
        setToken(el);
        break;
      }
    }
  });
  return (
    <div>
      {console.log("--------------------------------")}
      {/* {console.log(isUnapproved)} */}
      <div className={`my-item`}>
        <div className="imageContainer">
          <img
            src={urlFor(image && image[0])}
            width={250}
            height={250}
            className="product-image"
          />
        </div>
        <div className="text">
          <p className="product-name">{name}</p>
          <p className="product-warranty">
            {!isUnapproved ? (
              <>
                Warranty Card Minted: <span className="approved">Approved</span>
              </>
            ) : (
              <>
                Warranty Card Minted: <span className="pending">Pending</span>
              </>
            )}
          </p>
          <a
            href={`http://20.198.2.124:3000/warranty/${_id}`}
            className="product-address"
          >
            {_id}
          </a>
          <div className="buttons">
            <button
              disabled={isUnapproved}
              type="button"
              className="buy-now"
              onClick={handleResale}
              style={
                !isUnapproved ? {} : { opacity: 0.3, cursor: "not-allowed" }
              }
            >
              Re-sell
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProduct;
