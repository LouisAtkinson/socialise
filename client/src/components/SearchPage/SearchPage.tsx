import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import UserCard from '../UserCard/UserCard';
import './SearchPage.css';
import { UserCardProps } from '../../types/types';
import { useAuthContext } from '../../hooks/useAuthContext';
import { fetchUsersByQuery } from '../../services/userService';
import { apiBaseUrl } from '../../config';

const SearchPage: React.FC = () => {
  const { user } = useAuthContext();
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
    if (!user?.token) return;

    try {
      setLoading(true);
      const data: UserCardProps[] = await fetchUsersByQuery(searchQuery, user.token);
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
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
                  key={user.id} 
                  id={user.id}
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
