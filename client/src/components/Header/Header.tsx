import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Notifications from '../Notifications/Notifications';
import { useLogout } from '../../hooks/useLogout';
import { useAuthContext } from '../../hooks/useAuthContext';
import SearchBar from '../SearchBar/SearchBar';
import MobileNav from '../MobileNav/MobileNav';
import './Header.css';

function Header() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleMobileNavToggle = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  return (
    <header className="header">
      <Link to="/">
        <h1>Socialise</h1>
      </Link>
      <div className="nav-container">
        {user ? (
          <>
            <MobileNav isOpen={isMobileNavOpen} onClose={() => {setIsMobileNavOpen(false)}}/>

            <div className="mobile-notifications">
              <Notifications/>
            </div>
            
            <div className="burger-menu" onClick={handleMobileNavToggle}>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>

            <nav className="desktop-nav">
              <SearchBar closeMobileNav={null}/>
              <Notifications />
              <Link to="/">Home</Link>
              <Link to={`/user/${user?.id}`}>My Profile</Link>
              <Link to="/login" onClick={logout}>
                Logout
              </Link>
            </nav>
          </>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
        
      </div>
    </header>
  );
}

export default Header;