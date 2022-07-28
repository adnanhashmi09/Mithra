import React from 'react';
import Link from 'next/link';
import { AiOutlineShopping, AiOutlineUser } from 'react-icons/ai';

import { Cart } from './';
import { useStateContext } from '../context/StateContext';

const Navbar = () => {
  const { address } = useStateContext();

  return (
    <div className="navbar-container">
      <p className="logo">
        <Link href="/">
          <a>
            <AiOutlineShopping />
            Hermes
          </a>
        </Link>
      </p>

      <Link
        href="/my-items"
        passHref

        // onClick={() => setShowCart(true)}
      >
        <a className="nav-my-items">
          {address === '' ? (
            <>
              <AiOutlineUser className="cart-icon" /> My Items
            </>
          ) : (
            <>
              <img
                src={`https://avatars.dicebear.com/api/miniavs/${address}.svg`}
                alt="user"
                height={40}
              />
              My Items
            </>
          )}
        </a>
        {/* <span className="cart-item-qty">{totalQuantities}</span> */}
      </Link>

      {/* {showCart && <Cart />} */}
    </div>
  );
};

export default Navbar;
