import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Notifications from './Notifications';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import SearchBar from './SearchBar';

function Header() {
  const { user } = useAuthContext();
  const {logout} = useLogout();

  return (
    <header className="header">
      <Link to="/">
        <h1>Socialise</h1>
      </Link>
      <nav>
        {user ? (
          <>
            <SearchBar />
            <Link to="/">Home</Link>
            <Notifications/>
            <Link to={`/user/${user.id}`}>My Profile</Link>
            <Link to="/login" onClick={logout}>Logout</Link>
          </>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
