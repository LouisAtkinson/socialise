import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Post from '../Post/Post';
import PostForm from '../PostForm/PostForm';
import blankImage from '../../images/blank.png';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import FriendButton from '../FriendButton/FriendButton';
import { PostProps, CommentData, UserProfileProps, Like } from '../../types/types';
import { fetchDisplayPicture } from '../../helpers/helpers';
import UserFriend from '../UserFriend/UserFriend';
import './UserProfile.css';
import { apiBaseUrl } from '../../config';

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
        ? `${apiBaseUrl}/posts`
        : `${apiBaseUrl}/posts/friend/${userProfile.id}`; 

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

  const handleDeletePost = async (postId: number) => {
    try {
      const token = user?.token;
  
      if (!token) {
        logout();
        return;
      }
  
      const response = await fetch(`${apiBaseUrl}/posts/${postId}`, {
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
      
      setUserPosts(userPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  useEffect(() => {
    if (!user?.token || !id) return;
  
    Promise.all([
      fetch(`${apiBaseUrl}/user/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }).then(res => {
        if (!res.ok) throw new Error('Failed to fetch user profile');
        return res.json();
      }),
      fetchDisplayPicture(id, 'thumbnail', user.token),  
    ])
      .then(([userData, displayPicture]) => {
        setUserProfile({ ...userData, displayPicture });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user data or display picture:', error);
        setLoading(false);
      });
  }, [id, user?.token]);

  const fetchUserPosts = async () => {
    try {

      const token = user?.token; 

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`${apiBaseUrl}/posts/user/${id}`, {
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
  }, [id, user, friendshipStatus]);
  

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

      const response = await fetch(`${apiBaseUrl}/friends/status/${user?.id}/${id}`, {
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
    if (!isCurrentUserProfile()) checkFriendshipStatus();
  }, [id]);

  const handleAddFriend = async () => {
    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`${apiBaseUrl}/friends/add/${user?.id}/${id}`, {
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

      const response = await fetch(`${apiBaseUrl}/friends/accept/${user?.id}/${id}`, {
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

      const response = await fetch(`${apiBaseUrl}/friends/deny/${user?.id}/${id}`, {
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

      const response = await fetch(`${apiBaseUrl}/friends/remove/${user?.id}/${id}`, {
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

      const response = await fetch(`${apiBaseUrl}/friends/all/${id}`, {
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

  const canInteractWithProfile = () => {
    return isCurrentUserProfile() || friendshipStatus === 'friends';
  };

  const hasUserInfo = () => {
    return (
      (userProfile.visibility.birthday && userProfile.birthDay && userProfile.birthMonth) ||
      (userProfile.visibility.hometown && userProfile.hometown) ||
      (userProfile.visibility.occupation && userProfile.occupation)
    );
  };

  if (loading) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className="user-profile">
      <div className="profile-top">
        <div className="profile-picture">
          {userProfile.displayPicture ? (
            canInteractWithProfile() ? (
              <Link to={`/user/${userProfile.id}/display-picture`} state={{ user }}>
                <img src={userProfile.displayPicture} alt={`${userProfile.firstName}'s display picture`} />
              </Link>
            ) : (
              <img src={userProfile.displayPicture} alt={`${userProfile.firstName}'s display picture`} />
            )
          ) : (
            <img src={blankImage} alt={`Default blank profile picture`} />
          )}
        </div>

        <h2>{`${userProfile.firstName} ${userProfile.lastName}`}</h2>

        {!isCurrentUserProfile() && (
          <FriendButton 
            userId={userProfile.id} 
            friendshipStatus={friendshipStatus} 
            setFriendshipStatus={setFriendshipStatus} 
          />
        )}

        {canInteractWithProfile() && hasUserInfo() && 
          <div className='user-info'>
            {userProfile.visibility.birthday && userProfile.birthDay && userProfile.birthMonth && (
              <p>Birthday: {`${userProfile.birthMonth} ${userProfile.birthDay}`}</p>
            )}
            {userProfile.visibility.hometown && userProfile.hometown && (
              <p>Hometown: {userProfile.hometown}</p>
            )}
            {userProfile.visibility.occupation && userProfile.occupation && (
              <p>Occupation: {userProfile.occupation}</p>
            )}
          </div>
        }
        

        {isCurrentUserProfile() && (
          <Link to={`/user/${userProfile.id}/edit-profile`} state={{ user }}>
            <button className="edit-profile-button btn-transition">Edit Profile</button>
          </Link>
        )}
      </div>

      <div className="friends-section">
        <h3 className="section-title">Friends</h3>
        <div className="friends-list">
          {friendsList.length === 0 ? (
            <p>No friends added yet.</p>
          ) : (
            friendsList.slice(0, 2).map((friend: { id: string; firstName: string; lastName: string; }) => (             
              <UserFriend key={friend.id} friend={friend} />
            ))
          )}
        </div>
        {friendsList.length > 0 && (
          <Link to="friends" className="see-all-link">See All Friends</Link>
        )}
      </div>

      {canInteractWithProfile() && <div className="post-section">
        <h3>Posts</h3>
        <PostForm onSubmit={handlePostFormSubmit} />
        {userPosts.length === 0 ? (
          <p>No posts to display.</p>
        ) : (
          userPosts.map((post) => (
            <Post
              key={post.id}
              {...post}
              update={fetchUserPosts}
            />
          ))
        )}
      </div>}
    </div>
  );
}

export default UserProfile;
