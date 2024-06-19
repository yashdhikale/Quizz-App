import React, { useState } from 'react';
import '../App.css';

const Login = ({ onLogin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === '') {
      alert('Please enter your name');
      return;
    }
    onLogin(name);
  };

  return (
    <div className="login-page">
      <nav className="navbar">
        <div className="app-name">QUIZ APP</div>
      </nav>
      <div className="login-container">
        <div className="form-container">
          <h2 className="login-title">Login</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name" className="input-label">Enter your name:</label>
            <input
              type="text"
              id="name"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
            <button type="submit" className="login-button">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
