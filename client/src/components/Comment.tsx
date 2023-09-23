import React from 'react';

export interface CommentProps {
  profilePicture: string;
  fullName: string;
  datetime: string;
  content: string;
  onDelete: () => void;
}

function Comment({ profilePicture, fullName, datetime, content, onDelete }: CommentProps) {
  return (
    <div className="comment">
      <img src={profilePicture} alt={`${fullName}'s profile`} />
      <div className="comment-info">
        <p>{fullName}</p>
        <p>{datetime}</p>
      </div>
      <button className="delete-comment" onClick={onDelete}>
        Delete
      </button>
      <p className="comment-content">{content}</p>
    </div>
  );
}

export default Comment;
