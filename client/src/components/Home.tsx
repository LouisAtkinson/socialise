import React, { useState, useEffect } from 'react';
import PostForm from './PostForm';
import Post from './Post';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

interface PostData {
  _id: string;
  content: string;
  author: {
    _id: string;
    profilePicture: File | null;
    firstName: string;
    lastName: string;
  };
  date: string;
  likes: Like[];
  comments: CommentData[];
}

export interface CommentData {
  _id: string;
  author: {
    id: string;
    profilePicture: File | null;
    firstName: string;
    lastName: string;
  };
  content: string;
  date: string;
}

export interface Like {
  _id: string;
  firstName: string;
  lastName: string;
}

function Home() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [newPost, setNewPost] = useState<string>('');

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
      const data = await response.json();
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
            user: {
              id: user.id
            }
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
      <PostForm onSubmit={handlePostSubmit} />
      <div className="post-list">
        {posts && posts.length === 0 ? (
          <p>No posts yet. When you or your friends make posts, you will see them here!</p>
        ) : (
          posts.map((post) => (
            <Post
              key={post._id}
              postId={post._id}
              content={post.content}
              profilePicture={post.author.profilePicture}
              fullName={`${post.author.firstName} ${post.author.lastName}`}
              datetime={post.date}
              likes={post.likes}
              comments={post.comments}
              update={fetchPosts}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
