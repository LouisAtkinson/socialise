import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { useAuthContext } from './hooks/useAuthContext';
import { AuthContextProvider } from './context/AuthContext';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import DisplayPicture from './components/DisplayPicture';
import EditProfile from './components/EditProfile';
import Login from './components/Login';
import Register from './components/Register';
import SearchPage from './components/SearchPage';
import FriendPage from './components/FriendPage';
import PostPage from './components/PostPage';

function App() {
  const { user } = useAuthContext();
  const [initialPath, setInitialPath] = useState(window.location.pathname);

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route 
              path="/login" 
              element={user ? <Navigate to={initialPath} /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to={initialPath} /> : <Register />} 
            />
            <Route
              path="/user/:id"
              element={user ? <UserProfile /> : <Navigate to='/login' />}
            >
            </Route>
            <Route 
              path="/user/:id/display-picture" 
              element={user ? <DisplayPicture /> : <Navigate to='/login' />}
            />
            <Route 
              path="/user/:id/edit-profile" 
              element={user 
                ? <EditProfile currentUser={user}/> 
                : <Navigate to='/login' />}
            />
            <Route
              path="user/:id/friends"
              element={user ? <FriendPage /> : <Navigate to='/login' />}
            />
            <Route
              path="post/:id"
              element={user ? <PostPage /> : <Navigate to='/login' />}
            />
            <Route
              path="/search"
              element={user ? <SearchPage /> : <Navigate to='/login' />}
            />
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to='/login' />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default () => (
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);