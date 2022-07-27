import React from 'react';
import Link from 'next/link';

import { urlFor } from '../lib/client';

const Product = ({ product: { image, name, slug, price } }) => {
  const sold = false;
  return (
    <div>
      <Link href={`${sold ? '' : `/product/${slug.current}`}`}>
        <div className={`product-card ${sold ? 'sold' : ''}`}>
          <div className="imageContainer">
            <img
              src={urlFor(image && image[0])}
              width={250}
              height={250}
              className="product-image"
            />
            <span>SOLD</span>
          </div>
          <p className="product-name">{name}</p>
          <p className="product-price">${price}</p>
        </div>
      </Link>
    </div>
  );
};

export default Product;
