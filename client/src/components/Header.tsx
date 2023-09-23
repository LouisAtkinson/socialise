import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <Link to="/">
        <h1>Socialise</h1>
      </Link>
      <nav>
        <Link to="/">Home</Link>
        {/* Add links to the user's profile and logout */}
        <Link to="/user/:username">My Profile</Link>
        <Link to="/login">Logout</Link>
      </nav>
    </header>
  );
}

export default Header;
