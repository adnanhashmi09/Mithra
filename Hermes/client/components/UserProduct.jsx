import React from 'react';
import Link from 'next/link';

import { client, urlFor } from '../lib/client';
import { useStateContext } from '../context/StateContext';
import toast from 'react-hot-toast';

import { signMessage } from '../lib/signMessage';

const UserProduct = (
  { product: { image, name, approvalStatus, price, _id }, setReload, reload },
  isUnapproved
) => {
  const { qty, address } = useStateContext();
  const productSold = () => {
    return client
      .patch(_id)
      .set({ sold: false, approvalStatus: false })
      .commit();
  };

  const handleResale = async () => {
    const prm = signMessage(address);

    await toast.promise(prm, {
      loading: 'Loading...',
      success: (data) => {
        return 'Transaction signed successfully';
      },
      error: 'Transaction failed',
    });
    const myPromise = productSold();
    await toast.promise(myPromise, {
      loading: 'Listing in the market...',
      success: 'Listed successfully',
      error: 'Error ',
    });
    setReload(!reload);
  };
  return (
    <div>
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
            {isUnapproved !== undefined ? (
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
            href="https://etherscan.io/address/0x0676d673a2a0a13fe37a3ec7812a8ccc571ca07b"
            className="product-address"
          >
            63FaC9201494f0bd17B9892B9fae4d52fe3BD377
          </a>
          <div className="buttons">
            <button
              disabled={isUnapproved == undefined}
              type="button"
              className="buy-now"
              onClick={handleResale}
              style={
                isUnapproved != undefined
                  ? {}
                  : { opacity: 0.3, cursor: 'not-allowed' }
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
