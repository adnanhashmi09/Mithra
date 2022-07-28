import React from 'react';
import Link from 'next/link';

import { urlFor } from '../lib/client';

const UserProduct = ({ product: { image, name, slug, price } }) => {
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
            Warranty Card Minted: <span className="pending">Pending</span>
            {/* approved | pending */}
          </p>
          <a
            href="https://etherscan.io/address/0x0676d673a2a0a13fe37a3ec7812a8ccc571ca07b"
            className="product-address"
          >
            63FaC9201494f0bd17B9892B9fae4d52fe3BD377
          </a>
          <div className="buttons">
            <button type="button" className="buy-now">
              Re-sell
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProduct;
