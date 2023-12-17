import React, { useState } from 'react';
import Comment from './Comment'; 
import blankImage from '../images/blank.png';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { CommentData, Like, PostProps } from '../types/types';
import { Link } from 'react-router-dom';

function Post({ _id, content, author, date, likes, comments, update }: PostProps) {  
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');

  const [likesCount, setLikesCount] = useState<number>(likes.length);

  React.useEffect(() => {
    setIsLiked(likes.some(like => like._id === user?.id));
  }, [likes, user]);

  const handleLikeClick = async () => {
    try {
      const token = user?.token;
  
      if (!token) {
        logout();
        return;
      }
  
      const endpoint = isLiked ? `/api/posts/${_id}/unlike` : `/api/posts/${_id}/like`;
      const method = isLiked ? 'DELETE' : 'POST';

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: { id: user.id },
        }),
      });
  
      if (!response.ok) {
        console.error('Error liking post:', response.statusText);
        return;
      }
      update();
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`/api/posts/${_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.ok) {
        update();
      } else {
        console.error('Error deleting post:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (newComment) {
      try {
        const token = user?.token;
  
        if (!token) {
          logout();
          return;
        }
  
        const response = await fetch(`/api/posts/${_id}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            content: newComment, 
            user: {
              id: user.id
            } }),
        });
  
        if (!response.ok) {
          console.error('Error adding comment:', response.statusText);
          return;
        } else {
          update();
        }
  
        const newCommentData = await response.json();
        setNewComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <img
          src={author.profilePicture ? URL.createObjectURL(author.profilePicture) : blankImage}
          alt={`${author.firstName}'s profile`}
        />        
        <div className="post-info">
          <p>{`${author.firstName} ${author.lastName}`}</p>
          <p>{date}</p>
        </div>
        <button className="delete-post" onClick={handleDeleteClick}>
          Delete
        </button>
      </div>
      <p className="post-content">{content}</p>
      <div className="post-actions">
        <button className="like-button" onClick={handleLikeClick}>
          {isLiked ? 'Unlike' : 'Like'}
        </button>
        <p className="likes">
          {likes.length === 1 && (
            <>
              <Link to={`/user/${likes[0]._id}`} style={{ color: 'blue' }}>
                {likes[0].firstName} {likes[0].lastName}
              </Link>{' '}
              liked this
            </>
          )}
          {likes.length > 1 && (
            <>
              <Link to={`/user/${likes[0]._id}`} style={{ color: 'blue' }}>
                {likes[0].firstName} {likes[0].lastName}
              </Link>{' '}
              and{' '}
              {likes.length - 1} {likes.length - 1 === 1 ? 'other' : 'others'} liked this
            </>
          )}
        </p>    
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
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              _id={comment._id} 
              profilePicture={comment.author.profilePicture} 
              fullName={`${comment.author.firstName} ${comment.author.lastName}`}
              datetime={comment.date} 
              content={comment.content}
              postId={_id}
              update={update}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Post;