import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Post from './Post';
import PostForm from './PostForm';
import blankImage from '../images/blank.png';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import FriendButton from './FriendButton';
import { PostProps, CommentData, UserProfileProps, Like } from '../types/types';

function UserProfile() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const { id } = useParams<{ id: string }>();
  const [userPosts, setUserPosts] = useState<PostProps[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfileProps>({
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    hometown: '',
    occupation: '',
    profilePicture: null,
    visibility: {
      dateOfBirth: false,
      hometown: false,
      occupation: false
    }
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [friendshipStatus, setFriendshipStatus] = useState<string | null>(null);

  const [friendsList, setFriendsList] = useState([
    { id: 1, name: 'Friend 1', profilePicture: 'friend1.jpg' },
    { id: 2, name: 'Friend 2', profilePicture: 'friend2.jpg' },
  ]);

  const [newPost, setNewPost] = useState('');

  const handlePostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPost(e.target.value);
  };

  const handlePostFormSubmit = async (postContent: string) => {
    try {
      const token = user?.token; 
  
      if (!token) {
        logout();
        return;
      }
  
      const response = await fetch(`/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: id, content: postContent }),
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          logout();
        } else {
          console.error('Error adding post:', response.statusText);
        }
        return;
      }
  
      const data = await response.json();
      setUserPosts([...userPosts, data]);
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
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
        },
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          logout();
        } else {
          console.error('Error deleting post:', response.statusText);
        }
        return;
      } else {
        fetchUserPosts();
      }
      
      setUserPosts(userPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch(`/api/user/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setUserProfile(data);
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching user data:', error));
  }, [id]);

  const fetchUserPosts = async () => {
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

      if (!response.ok) {
        if (response.status === 401) {
          logout();
        } else {
          console.error('Error fetching user posts:', response.statusText);
        }
        return;
      }

      const data = await response.json();
      const userPosts = data.filter((post: PostProps) => post.author._id === id);
      setUserPosts(userPosts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [id, user]);
  

  const isCurrentUserProfile = () => {
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    return userProfile.id === currentUser?.id;
  };

  const checkFriendshipStatus = async () => {
    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`/api/friends/status/${user?.id}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFriendshipStatus(data.status);
      } else {
        console.error('Error checking friendship status:', response.statusText);
      }
    } catch (error) {
      console.error('Error checking friendship status:', error);
    }
  };

  useEffect(() => {
    console.log('Use effect triggered:', id)
    checkFriendshipStatus();
  }, [id]);

  const handleAddFriend = async () => {
    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`/api/friends/add/${user?.id}/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Friend request sent successfully');
        setFriendshipStatus('pending');
      } else {
        console.error('Error sending friend request:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleAcceptFriendRequest = async () => {
    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`/api/friends/accept/${user?.id}/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Friend request accepted successfully');
        setFriendshipStatus('friends');
      } else {
        console.error('Error accepting friend request:', response.statusText);
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleDenyFriendRequest = async () => {
    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`/api/friends/deny/${user?.id}/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Friend request denied successfully');
        setFriendshipStatus(null);
      } else {
        console.error('Error denying friend request:', response.statusText);
      }
    } catch (error) {
      console.error('Error denying friend request:', error);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`/api/friends/remove/${user?.id}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Friend removed successfully');
        setFriendshipStatus(null);
      } else {
        console.error('Error removing friend:', response.statusText);
      }
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  if (loading) {
    return <h3>Loading...</h3>
  }

  return (
    <div className="user-profile">
      <div className="user-info">
        <div className="profile-picture">
          <Link to={`/user/${userProfile.id}/display-picture`} state={{ user }}>
            <img src={userProfile.profilePicture ? URL.createObjectURL(userProfile.profilePicture) : blankImage} alt={`${userProfile.firstName}'s display picture`} />
          </Link>
        </div>
        <h2>{`${userProfile.firstName} ${userProfile.lastName}`}</h2>
        <FriendButton userId={userProfile.id} />
        {isCurrentUserProfile() && (
          <Link to={`/user/${userProfile.id}/edit-profile`} state={{ user }}>
            <button className="edit-profile-button">Edit Profile</button>
          </Link>
        )}
      </div>

      <div className="friends-section">
        <h3>Friends</h3>
        <div className="friends-list">
          {friendsList.map((friend) => (
            <div key={friend.id} className="friend">
              <img src={friend.profilePicture} alt={`${friend.name}'s profile`} />
              <p>{friend.name}</p>
            </div>
          ))}
        </div>
        <Link to="friends">See All Friends</Link>
      </div>

      <div className="post-section">
        <h3>Posts</h3>
        <PostForm onSubmit={handlePostFormSubmit} />
        {userPosts.length === 0 ? (
          <p>No posts to display.</p>
        ) : (
          userPosts.map((post) => (
            <Post
              key={post._id} 
              {...post}
              update={fetchUserPosts}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default UserProfile;
