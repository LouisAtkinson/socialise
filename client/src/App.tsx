import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { useAuthContext } from './hooks/useAuthContext';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import DisplayPicture from './components/DisplayPicture';
import EditProfile from './components/EditProfile';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const { user } = useAuthContext();

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route 
              path="/login" 
              element={user ? <Navigate to='/' /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to='/' /> : <Register />} 
            />
            {/* Protect the following routes for authenticated users */}
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
                element={user ? <EditProfile 
                  user={user}
                /> : <Navigate to='/login' />}
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

export default App;