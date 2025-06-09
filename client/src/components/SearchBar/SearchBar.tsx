import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBarProps } from '../../types/types';
import './SearchBar.css';

const SearchBar: React.FC<SearchBarProps> = ({ initialQuery = '', closeMobileNav }) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (closeMobileNav) closeMobileNav(false)
    navigate(`/search?query=${searchTerm}`);
  };

  return (
    <form onSubmit={handleSearchSubmit} className="search-bar">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button type="submit" className="search-button btn-transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;