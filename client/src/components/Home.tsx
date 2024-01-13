import React, { useState, useEffect } from 'react';
import PostForm from './PostForm';
import Post from './Post';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { CommentData, PostData, Like } from '../types/types';

function Home() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [newPost, setNewPost] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPosts = async () => {
    try {
      const token = user?.token;
      
      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`/api/posts/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
      logout();
      return;
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error:', errorData.error);
      return;
    }

    const data = await response.json();
    setLoading(false);

    if (data.error) {
      console.error('Error from server:', data.error);
      return;
    }

    setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);


  const handlePostSubmit = async (postContent: string) => {
    if (postContent) {
      try {
        const token = user?.token;
        
        if (!token) {
          logout();
          return;
        }
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            content: postContent, 
            userId: user.id
          }),
        });

        if (response.ok) {
          const newPost = await response.json();
          setNewPost('');
          fetchPosts();
        } else {
          console.error('Error adding post:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding post:', error);
      }
    }
  };

  return (
    <div className="home">
      <h2>Home</h2>
      <PostForm onSubmit={handlePostSubmit}/>
      <div className="post-list">
        {loading && <h3>Loading...</h3>}
        {!loading && (
          posts && posts.length === 0 ? (
            <p>No posts yet. When you or your friends make posts, you will see them here!</p>
          ) : (
            posts.map((post) => (
              <Post
                key={post._id}
                {...post}
                update={fetchPosts}
              />
            ))
          )
        )}
      </div>
    </div>
  );
}

export default Home;
