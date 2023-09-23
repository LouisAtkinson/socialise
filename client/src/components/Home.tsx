import React, { useState } from 'react';
import PostForm from './PostForm';
import Post from './Post';

function Home() {
  const [posts, setPosts] = useState<string[]>([]);
  const [newPost, setNewPost] = useState('');

  const handlePostSubmit = (postContent: string) => {
    if (postContent) {
      setPosts([postContent, ...posts]);
      setNewPost('');
    }
  };

  return (
    <div className="home">
      <h2>Home</h2>
      <PostForm onSubmit={handlePostSubmit} />
      <div className="post-list">
        {posts.map((post, index) => (
          <Post
            key={index}
            content={post}
            profilePicture="placeholder.jpg"
            fullName="John Doe"
            datetime="Just now"
            onDelete={() => {}}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
