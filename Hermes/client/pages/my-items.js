import React, { useEffect, useState } from 'react';

import { client } from '../lib/client';
import { UserProduct, FooterBanner, HeroBanner } from '../components';

import { useStateContext } from '../context/StateContext';
import useCheckWeb3Support from '../hooks/checkWeb3Support';

function myItems() {
  const { address } = useStateContext();
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(true);
  const [data, setData] = useState([]);
  useCheckWeb3Support();

  useEffect(async () => {
    if (address !== '') {
      const query = `*[_type == "product" && owner == "${address}"]`;
      const items = await client.fetch(query);
      setProducts(items);
    }

    const res = await fetch('http://localhost:5050/token/owner/all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ owner: address }),
    });

    const ServerData = await res.json();
    console.log(ServerData);
    setData(ServerData.tokens.unapproved);
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
            {products?.map((product) => {
              console.log('-----------------------------------------');
              const isUnapproved = data.find((el) => {
                console.log('el ', el.productId);
                console.log('product ', product._id);
                console.log(el.productId === product._id);
                return el.productId == product._id;
              });

              console.log(isUnapproved);

              return (
                <UserProduct
                  key={product._id}
                  product={product}
                  setReload={setReload}
                  reload={reload}
                  isUnapproved={isUnapproved}
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
