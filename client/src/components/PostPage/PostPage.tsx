import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../Post/Post';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import { PostProps } from '../../types/types';
import { fetchPostById } from '../../services/postService';
import './PostPage.css';
import { apiBaseUrl } from '../../config';

function PostPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [post, setPost] = useState<PostProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!user?.token) {
        logout();
        return;
      }

      try {
        const numericId = Number(id);

        if (isNaN(numericId)) {
          console.error('Invalid post ID');
          return;
        }
        
        const data = await fetchPostById(numericId, user.token);
        setPost(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching post:', error.message);
        } else {
          console.error('Unknown error fetching post');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, logout]);

  return (
    <div className="post-page">
      {loading ? (
        <p>Loading...</p>
      ) : !post ? (
        <p>No post available.</p>
      ) : (
        <Post {...post} />
      )}
    </div>
  );
}

export default PostPage;
