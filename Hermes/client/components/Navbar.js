import Link from 'next/link';

function Navbar() {
  return (
    <header>
      <div id="menu-bar" className="fas fa-bars"></div>

      <a href="#" className="logo">
        <i className="fas fa-shopping-bag"></i> Hermes
      </a>

      <nav className="navbar">
        <Link href="/#home" passHref>
          <a>home</a>
        </Link>
        <Link href="/#products" passHref>
          <a>products</a>
        </Link>
        <Link href="/#featured" passHref>
          <a>featured</a>
        </Link>
        <Link href="/#review" passHref>
          <a>review</a>
        </Link>
      </nav>

      <div className="icons">
        <a href="#" className="fas fa-user"></a>
      </div>
    </header>
  );
}

export default Navbar;
