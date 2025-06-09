import React, { useState, useEffect } from 'react';
import PostForm from '../PostForm/PostForm';
import Post from '../Post/Post';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import { CommentData, PostData, Like } from '../../types/types';
import { fetchPosts, createPost } from '../../services/postService';
import './Home.css';
import { apiBaseUrl } from '../../config';

function Home() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [newPost, setNewPost] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const loadPosts = async () => {
    if (!user?.token) {
      logout();
      return;
    }

    try {
      const postsData = await fetchPosts(user.token);
      setPosts(postsData);
    } catch (error) {
      if (error instanceof Error && error.message === 'Unauthorized') {
        logout();
      } else {
        console.error('Error fetching posts:', error instanceof Error ? error.message : error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [user]);


  const handlePostSubmit = async (postContent: string) => {
    if (!postContent) return;

    if (!user?.token) {
      logout();
      return;
    }

    try {
      await createPost(user.token, postContent, user.id);
      setNewPost('');
      loadPosts();
    } catch (error) {
      if (error instanceof Error && error.message === 'Unauthorized') {
        logout();
      } else {
        console.error('Error adding post:', error instanceof Error ? error.message : error);
      }
    }
  };

  return (
    <div className="home">
      <h2>Welcome back!</h2>
      <PostForm onSubmit={handlePostSubmit}/>
      <div className="post-list">
        {loading && <h3>Loading...</h3>}
        {!loading && (
          posts && posts.length === 0 ? (
            <p>No posts yet. When you or your friends make posts, you will see them here!</p>
          ) : (
            posts.map((post) => (
              <Post
                key={post.id}
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
