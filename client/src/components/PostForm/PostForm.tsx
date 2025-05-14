import React, { useState } from 'react';
import { PostFormProps } from '../../types/types';
import './PostForm.css';

function PostForm({ onSubmit }: PostFormProps) {
  const [newPost, setNewPost] = useState('');

  const handlePostChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewPost(e.target.value);
  };

  const handlePostSubmit = () => {
    if (newPost) {
      onSubmit(newPost);
      setNewPost('');
    }
  };

  return (
    <div className="post-form">
      <textarea
        placeholder="Write a post..."
        value={newPost}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handlePostChange(e)}
      />
      <button onClick={handlePostSubmit}>Post</button>
    </div>
  );
}

export default PostForm;
