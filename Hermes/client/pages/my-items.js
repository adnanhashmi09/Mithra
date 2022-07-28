import React, { useEffect, useState } from 'react';

import { client } from '../lib/client';
import { UserProduct, FooterBanner, HeroBanner } from '../components';

import { useStateContext } from '../context/StateContext';
import useCheckWeb3Support from '../hooks/checkWeb3Support';

function myItems() {
  const { address } = useStateContext();
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(true);
  useCheckWeb3Support();

  useEffect(async () => {
    if (address !== '') {
      const query = `*[_type == "product" && owner == "${address}"]`;
      const items = await client.fetch(query);
      setProducts(items);
    }
  }, [address, reload]);

  return (
    <div>
      {address === '' ? (
        <>
          <h1 style={{ textAlign: 'center', marginBottom: '80px' }}>
            Please connect to your metamask wallet to view your items.
          </h1>
        </>
      ) : (
        <>
          <h1 style={{ textAlign: 'center', marginBottom: '80px' }}>
            My Products
          </h1>
          <div className="my-item-container">
            {products?.map((product) => (
              <UserProduct
                key={product._id}
                product={product}
                setReload={setReload}
                reload={reload}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default myItems;
