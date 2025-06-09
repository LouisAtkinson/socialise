import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { loginUser } from '../../services/userService';
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
  const [error, setError] = React.useState<string | null>(null);
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
      const userData = await loginUser(formData);
      setLoading(false);
      localStorage.setItem('user', JSON.stringify(userData));
      dispatch({ type: 'LOGIN', payload: userData });
      console.log(userData);
      window.location.href = '/';
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        setError(error.message);
        console.error('Login error:', error.message);
      } else {
        console.error('Login error:', error);
      }
    }
  }

  return (
    <div className='login-page'>
      <div className="introduction-container">
        <h2 className="introduction-title">Hello and welcome!</h2>
        <br/>
        <p>
          This social media site is built with React and TypeScript on the front-end, and .NET on the back-end, using PostgreSQL as the database.
        </p>
        <br/>
        <p>
          It is deployed on AWS using Elastic Beanstalk, S3, CloudFront, and Route 53 for reliable and scalable hosting.
        </p>
        <br/>
        <p>
          A ready-made user is provided, but feel free to create your own account if you wish. You can view the source code for the <a href="https://github.com/LouisAtkinson/socialise" target="_blank" rel="noopener noreferrer">front-end</a> and the <a href="https://github.com/LouisAtkinson/socialise.NET" target="_blank" rel="noopener noreferrer">back-end</a> on GitHub.
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
