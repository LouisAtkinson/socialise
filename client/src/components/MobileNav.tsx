import React from 'react';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { MobileNavProps } from '../types/types';
import SearchBar from './SearchBar';

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className={`mobile-nav ${isOpen ? 'open' : ''}`}>
      <div className="overlay" onClick={onClose}></div>
      <nav className="mobile-nav-content">
        <div className="close-button" onClick={onClose}>
          &times;
        </div>
        <SearchBar closeMobileNav={onClose}/>
        <Link to="/" onClick={onClose}>Home</Link>
        <Link to={`/user/${user?.id}`} onClick={onClose}>My Profile</Link>
        <Link to="/login" onClick={handleLogout}>
          Logout
        </Link>
      </nav>
    </div>
  );
};

export default MobileNav;