import React from 'react';
import Link from 'next/link';
import { AiOutlineShopping, AiOutlineUser } from 'react-icons/ai';

import { Cart } from './';
import { useStateContext } from '../context/StateContext';

const Navbar = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext();

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
          <AiOutlineUser className="cart-icon" /> My Items
        </a>
        {/* <span className="cart-item-qty">{totalQuantities}</span> */}
      </Link>

      {/* {showCart && <Cart />} */}
    </div>
  );
};

export default Navbar;
