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
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query') || '';
    setSearchQuery(query);
  }, [location]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://socialise-seven.vercel.app/api/user/search/${searchQuery}`);
        if (response.ok) {
          setLoading(false);
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
      <SearchBar initialQuery={searchQuery} closeMobileNav={null}/>
      {loading && <h3 className='search-loading'>Loading...</h3>}
      {!loading && (
        <div className="user-list">
          {users?.length === 0 && (<h4 className='no-users'>No users match search criteria</h4>)}
          {currentUsers.map((user) => (
              <UserCard
                  key={user._id} 
                  _id={user._id}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  hometown={user.hometown || null}
                  visibility={user.visibility}
              />        
          ))}
        </div>
      )}
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
