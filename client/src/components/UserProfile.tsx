import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Post from './Post';
import PostForm from './PostForm';
import blankImage from '../images/blank.png';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import FriendButton from './FriendButton';
import { PostProps, CommentData, UserProfileProps, Like } from '../types/types';
import { fetchDisplayPicture } from '../helpers/helpers';
import UserFriend from './UserFriend';

function UserProfile() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const { id } = useParams<{ id: string }>();
  const [userPosts, setUserPosts] = useState<PostProps[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfileProps>({
    id: '',
    firstName: '',
    lastName: '',
    birthDay: '',
    birthMonth: '',
    hometown: '',
    occupation: '',
    displayPicture: null,
    visibility: {
      birthday: false,
      hometown: false,
      occupation: false
    }
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [friendshipStatus, setFriendshipStatus] = useState<string | null>(null);
  const [friendsList, setFriendsList] = useState([]);
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

      const postEndpoint = isCurrentUserProfile()
        ? '/api/posts'
        : `/api/posts/${userProfile.id}`; 

      const response = await fetch(postEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id, content: postContent }),
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
      fetchUserPosts();
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
  
      const response = await fetch(`https://socialise-seven.vercel.app/api/posts/${postId}`, {
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
    Promise.all([
      fetch(`https://socialise-seven.vercel.app/api/user/${id}`).then((response) => response.json()),
      fetch(`https://socialise-seven.vercel.app/api/display-pictures/user/${id}`).then((response) => response.blob())
    ])
    .then(([userData, displayPictureBlob]) => {
      if (displayPictureBlob instanceof Blob && !displayPictureBlob.type.startsWith('application/')) {
        setUserProfile({ ...userData, displayPicture: URL.createObjectURL(displayPictureBlob) });
      } else {
        console.error('Invalid display picture data:', displayPictureBlob);
        setUserProfile({ ...userData });
      }
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

      const response = await fetch(`https://socialise-seven.vercel.app/api/posts/user/${id}`, {
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
      setUserPosts(data);
      setLoading(false);
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

      const response = await fetch(`https://socialise-seven.vercel.app/api/friends/status/${user?.id}/${id}`, {
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
    checkFriendshipStatus();
  }, [id]);

  const handleAddFriend = async () => {
    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`https://socialise-seven.vercel.app/api/friends/add/${user?.id}/${id}`, {
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

      const response = await fetch(`https://socialise-seven.vercel.app/api/friends/accept/${user?.id}/${id}`, {
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

      const response = await fetch(`https://socialise-seven.vercel.app/api/friends/deny/${user?.id}/${id}`, {
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

      const response = await fetch(`https://socialise-seven.vercel.app/api/friends/remove/${user?.id}/${id}`, {
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

  const fetchFriendsList = async () => {
    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`https://socialise-seven.vercel.app/api/friends/all/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFriendsList(data);
      } else {
        console.error('Error fetching friends list:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching friends list:', error);
    }
  };

  useEffect(() => {
    fetchFriendsList();
  }, [id]);

  if (loading) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className="user-profile">
      <div className="user-info">
        <div className="profile-picture">
          {userProfile.displayPicture ? (
            <Link to={`/user/${userProfile.id}/display-picture`} state={{ user }}>
              <img src={userProfile.displayPicture} alt={`${userProfile.firstName}'s display picture`} />
            </Link>
          ) : (
            <img src={blankImage} alt={`Default blank profile picture`} />
          )}
        </div>

        <h2>{`${userProfile.firstName} ${userProfile.lastName}`}</h2>

        <FriendButton userId={userProfile.id} />

        {userProfile.visibility.birthday && userProfile.birthDay && userProfile.birthMonth && (
          <p>Birthday: {`${userProfile.birthMonth} ${userProfile.birthDay}`}</p>
        )}
        {userProfile.visibility.hometown && userProfile.hometown && (
          <p>Hometown: {userProfile.hometown}</p>
        )}
        {userProfile.visibility.occupation && userProfile.occupation && (
          <p>Occupation: {userProfile.occupation}</p>
        )}

        {isCurrentUserProfile() && (
          <Link to={`/user/${userProfile.id}/edit-profile`} state={{ user }}>
            <button className="edit-profile-button">Edit Profile</button>
          </Link>
        )}
      </div>

      <div className="friends-section">
        <h3 className="section-title">Friends</h3>
        <div className="friends-list">
          {friendsList.length === 0 ? (
            <p>No friends added yet.</p>
          ) : (
            friendsList.slice(0, 2).map((friend: { _id: string; firstName: string; lastName: string; }) => (             
              <UserFriend key={friend._id} friend={friend} />
            ))
          )}
        </div>
        <Link to="friends" className="see-all-link">See All Friends</Link>
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
