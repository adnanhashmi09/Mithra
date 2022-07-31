import React, { useEffect, useState } from 'react';

import { client } from '../lib/client';
import { UserProduct, FooterBanner, HeroBanner } from '../components';

import { useStateContext } from '../context/StateContext';
import useCheckWeb3Support from '../hooks/checkWeb3Support';

function myItems() {
  const { address } = useStateContext();
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(true);
  const [data, setData] = useState({});
  useCheckWeb3Support();

  useEffect(async () => {
    if (address !== '') {
      const query = `*[_type == "product" && owner == "${address}" && sold == true]`;
      const items = await client.fetch(query);
      setProducts(items);
      // console.log(items);
    }

    try {
      const res = await fetch('http://localhost:5050/token/owner/all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner: address }),
      });

      const ServerData = await res.json();
      // console.log(ServerData);
      setData(ServerData.tokens);
    } catch (error) {
      console.log(error);
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
            {products.map((product) => {
              return (
                <UserProduct
                  key={product._id}
                  product={product}
                  setReload={setReload}
                  reload={reload}
                  mongoData={data}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default myItems;
