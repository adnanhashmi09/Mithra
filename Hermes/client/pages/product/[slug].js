import React, { useEffect, useState } from 'react';
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from 'react-icons/ai';

import { client, urlFor } from '../../lib/client';
import { Product } from '../../components';
import toast from 'react-hot-toast';
import getStripe from '../../lib/getStripe';
import { useStateContext } from '../../context/StateContext';
import useCheckWeb3Support from '../../hooks/checkWeb3Support';

const styles = {
  position: 'absolute',
  top: '30%',
  left: '50%',
  transform: 'rotate(-45deg) translate(-50%, -50%)',
  fontWeight: 'bold',
  fontSize: '70px',
  color: '#c50f0f',
  display: 'block',
};

const ProductDetails = ({ product, products }) => {
  const { image, name, details, price, sold } = product;
  const [index, setIndex] = useState(0);
  const { qty, address } = useStateContext();
  console.log(sold);

  useCheckWeb3Support();
  const productSold = () => {
    client
      .patch(product._id)
      .set({ sold: true, approvalStatus: false, owner: address })
      .commit()
      .then((updatedBike) => {
        console.log(updatedBike);
      })
      .catch((err) => {
        console.error('Oh no, the update failed: ', err.message);
      });
  };
  const handleBuyNow = async () => {
    if (address === '') {
      toast.error('please connect to metamask');
      return;
    }
    productSold();
    const stripe = await getStripe();
    const gas = 20;
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ product, qty, gas }]),
    });

    if (response.statusCode === 500) return;

    const data = await response.json();

    toast.loading('Redirecting...');

    stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div>
      <div className="product-detail-container">
        <div className={`leftImages ${sold ? 'sold' : ''}`}>
          <div className="image-container">
            <img
              src={urlFor(image && image[index])}
              className="product-detail-image"
            />
            <span style={sold ? styles : { display: 'none' }}>SOLD</span>
          </div>
          <div className="small-images-container">
            {image?.map((item, i) => (
              <img
                key={i}
                src={urlFor(item)}
                className={
                  i === index ? 'small-image selected-image' : 'small-image'
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
          <p className="price">₹ {price}</p>

          <div
            className="buttons"
            style={sold ? { opacity: 0.3, pointerEvents: 'none' } : {}}
          >
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
    fallback: 'blocking',
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
