import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import './Login.css';
import { apiBaseUrl } from '../../config';

function Login() {
  const [formData, setFormData] = useState({
    email: 'JohnFoobar-DEMO@gmail.com',
    password: 'Johnfoobar1!',
  });

  // const [formData, setFormData] = useState({
  //   email: "a@a.com",
  //   password: "Password1!"
  // });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();

  const { email, password } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      console.log("Before fetch:", formData);
  
      const response = await fetch(`${apiBaseUrl}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      console.log("After fetch:", response);
  
      const json = await response.json();
  
      if (response.ok) {
        setLoading(false);
        localStorage.setItem('user', JSON.stringify(json));
        dispatch({type: 'LOGIN', payload: json});
        console.log(json);
        window.location.href = '/';
      } else {
        setLoading(false);
        setError(json.error);
        console.error(error);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className='login-page'>
      <div className="introduction-container">
        <h2 className="introduction-title">Hello and welcome!</h2>
        <br/>
        <p>
          This social media site was built using Typescript and React on the front-end, and Express with MongoDB on the back-end.
        </p>
        <br/>
        <p>
          A ready-made user is provided, however feel free to create your own account if you wish.
          You can also check out the source code on <a href="https://github.com/LouisAtkinson/socialise" target="_blank" rel="noopener noreferrer">GitHub</a> to see how it was built.
        </p>
      </div>
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="login-button btn-transition">
            Login
          </button>
          {error && <div className='error'>{error}</div>}
        </form>
        <p className="login-register-text">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div> 
  );
}

export default Login;
