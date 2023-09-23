import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

// Import your components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Protect the following routes for authenticated users */}
            <Route
              path="/user/:id"
              element={<PrivateRoute element={<UserProfile />} />}
            />
            <Route
              path="/"
              element={<PrivateRoute element={<Home />} />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

// Create a PrivateRoute component to protect routes for authenticated users
function PrivateRoute({ element, ...rest }: any) {
  const isAuthenticated = true; // Replace with actual authentication logic

  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/login" replace />
  );
}
