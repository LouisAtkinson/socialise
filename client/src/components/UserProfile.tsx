import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Post from './Post';
import PostForm from './PostForm';
import blankImage from '../images/blank.png';

function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const [userPosts, setUserPosts] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState({
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    birthday: 'January 1, 1990',
    hometown: 'New York',
    occupation: 'Software Developer',
    profilePicture: undefined,
  });

  const [friendsList, setFriendsList] = useState([
    { id: 1, name: 'Friend 1', profilePicture: 'friend1.jpg' },
    { id: 2, name: 'Friend 2', profilePicture: 'friend2.jpg' },
    // Add more friends here
  ]);

  const [newPost, setNewPost] = useState('');

  const handlePostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPost(e.target.value);
  };

  const handlePostFormSubmit = (postContent: string) => {
    if (postContent) {
      setUserPosts([...userPosts, postContent]);
    }
  };

  const handleDeletePost = (index: number) => {
    const updatedPosts = [...userPosts];
    updatedPosts.splice(index, 1);
    setUserPosts(updatedPosts);
  };

  return (
    <div className="user-profile">
      <div className="user-info">
        <div className="profile-picture">
          <img src={userProfile.profilePicture ? userProfile.profilePicture : blankImage} alt={`${userProfile.firstName}'s profile`} />
        </div>
        <h2>{`${userProfile.firstName} ${userProfile.lastName}`}</h2>
        <p>Birthday: {userProfile.birthday}</p>
        <p>Hometown: {userProfile.hometown}</p>
        <p>Occupation: {userProfile.occupation}</p>
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
        <PostForm onSubmit={handlePostFormSubmit} /> {/* Pass the onSubmit prop */}
        {userPosts.map((post, index) => (
          <Post
            key={index}
            profilePicture={userProfile.profilePicture ? userProfile.profilePicture : blankImage}
            fullName={`${userProfile.firstName} ${userProfile.lastName}`}
            datetime="Date/Time"
            content={post}
            onDelete={() => handleDeletePost(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default UserProfile;
