import React, { useState } from 'react';
import { Like, LikesSectionProps } from '../types/types';
import LikesPopup from './LikesPopup';
import { Link } from 'react-router-dom';

const LikesSection: React.FC<LikesSectionProps> = ({ likes }) => {
  const [showLikesPopup, setShowLikesPopup] = useState(false);

  const renderLikeLink = (like: Like) => (
    <Link key={like._id} to={`/user/${like._id}`} className="like-link">
      {`${like.firstName} ${like.lastName}`}
    </Link>
  );

  const renderLikes = () => {
    const likesCount = likes.length;

    if (likesCount === 0) {
      return null;
    }

    if (likesCount === 1) {
      return <>{renderLikeLink(likes[0])} likes this</>;
    } else if (likesCount === 2) {
      return (
        <>
          {renderLikeLink(likes[0])} and {renderLikeLink(likes[1])} like this
        </>
      );
    } else {
      const remainingLikesCount = likesCount - 2;
      return (
        <>
          {renderLikeLink(likes[0])}, {renderLikeLink(likes[1])}, and{' '}
          <Link to="#" onClick={() => setShowLikesPopup(true)} className="remaining-likes">
            {remainingLikesCount} others
          </Link>{' '}
          like this
        </>
      );
    }
  };

  return (
    <div className="likes-section">
      {renderLikes()}
      {showLikesPopup && <LikesPopup likes={likes} onClose={() => setShowLikesPopup(false)} />}
    </div>
  );
};

export default LikesSection;