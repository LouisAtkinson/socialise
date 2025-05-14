import React from 'react';
import { Like, LikesPopupProps } from '../../types/types';
import UserCard from '../UserCard/UserCard';
import './LikesPopup.css';

const LikesPopup: React.FC<LikesPopupProps> = ({ likes, onClose }) => {
  return (
    <div className="likes-popup">
      <div className="likes-popup-header">
        <h2>Likes</h2>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="likes-popup-content">
        {likes.map((like) => (
          <UserCard
            key={like._id}
            _id={like._id}
            firstName={like.firstName}
            lastName={like.lastName}
            hometown={null}
            visibility={{hometown: false}}
          />
        ))}
      </div>
    </div>
  );
};

export default LikesPopup;