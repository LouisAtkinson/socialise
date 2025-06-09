import React from 'react';
import { Link } from 'react-router-dom';
import blankImage from '../../images/blank.png';
import { useAuthContext } from '../../hooks/useAuthContext';
import FriendButton from '../FriendButton/FriendButton';
import { UserCardProps } from '../../types/types';
import { fetchDisplayPicture } from '../../services/displayPictureService';
import { useLogout } from '../../hooks/useLogout';
import { apiBaseUrl } from '../../config';
import './UserCard.css';

const UserCard: React.FC<UserCardProps> = ({
  id,
  firstName,
  lastName,
  hometown,
  visibility,
}) => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const isCurrentUser = user?.id === id;
  const [userDisplayPicture, setUserDisplayPicture] = React.useState<string | null>(null);
  const [friendshipStatus, setFriendshipStatus] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getProfilePicture = async () => {
      const token = user?.token;
      const picture = await fetchDisplayPicture(id, 'thumbnail', token);
      setUserDisplayPicture(picture);
    };

    getProfilePicture();
  }, [id]);

  return (
    <div className='user-card'>
      <div className='user-card-left'>
        <Link to={`/user/${id}`}>
          <div className="user-card-display-picture">
            <img src={userDisplayPicture ? userDisplayPicture : blankImage} alt="User's display picture" />
          </div>
        </Link>
        <div className="user-card-details">
          <div>
            <h3 className='user-card-name'>
              <Link to={`/user/${id}`} className='user-link'>
                {`${firstName} ${lastName}`}
              </Link>
              {isCurrentUser && <span className='you-text'>(you)</span>}
            </h3>
          </div>
          
          {visibility?.hometown && hometown && <p>Hometown: {hometown}</p>}
        </div>
      </div>
      <div className='user-name-right'>
        <div className="user-card-friendship-actions">
              <FriendButton 
                userId={id} 
                friendshipStatus={friendshipStatus} 
                setFriendshipStatus={setFriendshipStatus} 
              />
          </div>
      </div>
      
    </div>
  );
};

export default UserCard;
