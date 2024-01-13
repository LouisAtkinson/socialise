import React from 'react';
import { Link } from 'react-router-dom';
import blankImage from '../images/blank.png';
import { useAuthContext } from '../hooks/useAuthContext';
import FriendButton from './FriendButton';
import { UserCardProps } from '../types/types';
import { fetchDisplayPicture } from '../helpers/helpers';

const UserCard: React.FC<UserCardProps> = ({
  _id,
  firstName,
  lastName,
  hometown,
  visibility,
}) => {
  const { user } = useAuthContext();
  const isCurrentUser = user?.id === _id;
  const [userDisplayPicture, setUserDisplayPicture] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getProfilePicture = async () => {
      const picture = await fetchDisplayPicture(_id);
      setUserDisplayPicture(picture);
    };

    getProfilePicture();
  }, [_id]);

  return (
    <div className='user-card'>
      <Link to={`/user/${_id}`}>
        <div className="user-card-display-picture">
          <img src={userDisplayPicture ? userDisplayPicture : blankImage} alt="User's display picture" />
        </div>
      </Link>
      <div className="user-card-details">
      <div>
        <h3 className='user-card-name'>
          <Link to={`/user/${_id}`} className='user-link'>
            {`${firstName} ${lastName}`}
          </Link>
          {isCurrentUser && <span className='you-text'>(you)</span>}
        </h3>
      </div>
        
        {visibility?.hometown && hometown && <p>Hometown: {hometown}</p>}
      </div>
      <div className="user-card-friendship-actions">
        <FriendButton userId={_id} />
      </div>
    </div>
  );
};

export default UserCard;
