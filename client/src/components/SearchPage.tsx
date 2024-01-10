import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import UserCard from './UserCard';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 20;
  const totalPages = Math.ceil(users.length / usersPerPage);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query') || '';
    setSearchQuery(query);
  }, [location]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/user/search/${searchQuery}`);
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Error searching users:', response.statusText);
        }
      } catch (error) {
        console.error('Error searching users:', error);
      }
    };

    if (searchQuery !== '') {
      fetchUsers();
    }
  }, [searchQuery]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="search-page">
      <SearchBar initialQuery={searchQuery} />
      <div className="user-list">
        {currentUsers.map((user) => (
            <UserCard
                key={user._id} 
                _id={user._id}
                displayPicture={user.displayPicture}
                firstName={user.firstName}
                lastName={user.lastName}
                hometown={user.hometown || null}
                visibility={user.visibility}
            />        
        ))}
      </div>
      {(totalPages < 2) ? <></> : 
        <div className="pagination">
          {Array.from({ length: Math.ceil(users.length / usersPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      }
      
    </div>
  );
};

export default SearchPage;
