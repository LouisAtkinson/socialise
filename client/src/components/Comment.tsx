import React from 'react';
import blankImage from '../images/blank.png';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { CommentProps } from '../types/types';
import { formatDate } from '../helpers/helpers';
import { Link } from 'react-router-dom';

function Comment({ _id, profilePicture, fullName, datetime, content, postId, update }: CommentProps) {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  
  const handleDeleteClick = async () => {
    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`/api/posts/${postId}/comments/${_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.ok) {
        update();
      } else {
        console.error('Error deleting comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  
  return (
    <div className="comment">
      <Link to={`/user/${_id}`}>
        <img
          src={profilePicture ? URL.createObjectURL(profilePicture) : blankImage}
          alt={`${fullName}'s display picture`}
        />
      </Link>
      <div className="comment-info">
        <div className='comment-name-date'>
          <Link to={`/user/${_id}`}>
            <p className='comment-author'>{fullName}</p>
          </Link>
          <p>{formatDate(datetime)}</p>
        </div>
        <p className="comment-content">{content}</p>          
      </div>
      <button className="delete-comment" onClick={handleDeleteClick}>
        Delete
      </button>
    </div>
  );
}

export default Comment;