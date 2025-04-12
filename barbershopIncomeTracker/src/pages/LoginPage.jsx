import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

import Cookies from 'js-cookie';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setError(''); // Clear any previous errors

  try {
    const response = await axiosInstance.post('/api/users/login', { email, password });
    const { token } = response.data;

    // Save the token to cookies
    Cookies.set('token', token, { expires: 7 }); // Token will expire in 7 days

    // Redirect to the dashboard or home page
    navigate('/dashboard');
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed. Please try again.');
  }
};

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;