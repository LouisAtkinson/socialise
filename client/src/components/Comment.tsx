import React from 'react';
import blankImage from '../images/blank.png';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

export interface CommentProps {
  _id: string,
  profilePicture: File | null;
  fullName: string;
  datetime: string;
  content: string;
  postId: string;
  update: Function;
}

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
      <img src={profilePicture ? URL.createObjectURL(profilePicture) : blankImage} alt={`${fullName}'s profile`} />
      <div className="comment-info">
        <p>{fullName}</p>
        <p>{datetime}</p>
      </div>
      <button className="delete-comment" onClick={handleDeleteClick}>
        Delete
      </button>
      <p className="comment-content">{content}</p>
    </div>
  );
}

export default Comment;