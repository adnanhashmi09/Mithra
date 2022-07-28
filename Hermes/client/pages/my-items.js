import React from 'react';

import { client } from '../lib/client';
import { UserProduct, FooterBanner, HeroBanner } from '../components';

function myItems({ products, bannerData }) {
  return (
    <div>
      <div className="my-item-container">
        {products?.map((product) => (
          <UserProduct key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  return {
    props: { products, bannerData },
  };
};

export default myItems;
