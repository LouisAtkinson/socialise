import React, { useState } from 'react';
import Comment, { CommentProps } from './Comment'; // Import CommentProps
import blankImage from '../images/blank.png';

interface PostProps {
  profilePicture: string | undefined;
  fullName: string;
  datetime: string;
  content: string;
  onDelete: () => void;
}

function Post({ profilePicture, fullName, datetime, content, onDelete }: PostProps) {
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [newComment, setNewComment] = useState<string>('');

  const handleLikeClick = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  const handleCommentSubmit = () => {
    if (newComment) {
      const comment: CommentProps = {
        profilePicture: blankImage, // Replace with the commenter's profile picture
        fullName: 'Commenter Name', // Replace with the commenter's full name
        datetime: 'Date/Time', // Replace with the actual date/time
        content: newComment,
        onDelete: () => {
          // Implement delete comment logic if needed
        },
      };

      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <img src={profilePicture ? profilePicture : blankImage} alt={`${fullName}'s profile`} />
        <div className="post-info">
          <p>{fullName}</p>
          <p>{datetime}</p>
        </div>
        <button className="delete-post" onClick={onDelete}>
          Delete
        </button>
      </div>
      <p className="post-content">{content}</p>
      <div className="post-actions">
        <button className="like-button" onClick={handleLikeClick}>
          {isLiked ? 'Unlike' : 'Like'}
        </button>
        <p className="likes">{likes} {likes === 1 ? 'like' : 'likes'}</p>
        <button className="comment-button" onClick={() => setShowComments(!showComments)}>
          {showComments ? 'Hide Comments' : 'Comment'}
        </button>
      </div>
      {showComments && (
        <div className="comments">
          <textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleCommentSubmit}>Submit</button>
          {comments.map((comment, index) => (
            <Comment key={index} {...comment} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Post;
