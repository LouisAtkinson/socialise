import React, { useState } from 'react';

interface PostFormProps {
  onSubmit: (postContent: string) => void;
}

function PostForm({ onSubmit }: PostFormProps) {
  const [newPost, setNewPost] = useState('');

  const handlePostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <input
        type="text"
        placeholder="Write a post..."
        value={newPost}
        onChange={handlePostChange}
      />
      <button onClick={handlePostSubmit}>Post</button>
    </div>
  );
}

export default PostForm;
