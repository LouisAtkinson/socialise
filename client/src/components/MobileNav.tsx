import React from 'react';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { MobileNavProps } from '../types/types';
import SearchBar from './SearchBar';

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  return (
    <div className={`mobile-nav ${isOpen ? 'open' : ''}`}>
      <div className="overlay" onClick={onClose}></div>
      <nav className="mobile-nav-content">
        <div className="close-button" onClick={onClose}>
          &times;
        </div>
        <SearchBar/>
        <Link to="/">Home</Link>
        <Link to={`/user/${user?.id}`}>My Profile</Link>
        <Link to="/login" onClick={logout}>
          Logout
        </Link>
      </nav>
    </div>
  );
};

export default MobileNav;