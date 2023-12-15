import React, { useState } from 'react';
import Comment, { CommentProps } from './Comment'; 
import blankImage from '../images/blank.png';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { CommentData, Like } from './Home';
import { Link } from 'react-router-dom';

interface PostProps {
  postId: string;
  profilePicture: File | null;
  fullName: string;
  datetime: string;
  content: string;
  likes: Like[];
  comments: CommentData[];
  update: Function;
}

function Post({ postId, profilePicture, fullName, datetime, content, likes, comments, update }: PostProps) {
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
  
      const endpoint = isLiked ? `/api/posts/${postId}/unlike` : `/api/posts/${postId}/like`;
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

      const response = await fetch(`/api/posts/${postId}`, {
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
  
        const response = await fetch(`/api/posts/${postId}/comments`, {
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

        // const comment: CommentProps = {
        //   _id: newCommentData._id, 
        //   profilePicture: newCommentData.commenter.profilePicture, 
        //   fullName: newCommentData.commenter.fullName,
        //   datetime: newCommentData.date,
        //   content: newCommentData.content,
        //   postId: postId,
        //   update: update
        // };
    
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
          src={profilePicture ? URL.createObjectURL(profilePicture) : blankImage}
          alt={`${fullName}'s profile`}
        />        
        <div className="post-info">
          <p>{fullName}</p>
          <p>{datetime}</p>
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
              postId={postId}
              update={update}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Post;
