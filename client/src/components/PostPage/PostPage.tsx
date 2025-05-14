import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../Post/Post';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import { PostProps } from '../../types/types';
import './PostPage.css';

function PostPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [post, setPost] = useState<PostProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = user?.token;

        if (!token) {
          logout();
          return;
        }

        const response = await fetch(`https://socialise-seven.vercel.app/api/posts/post/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching post');
        }

        const data = await response.json();
        setPost(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
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
