import React, { useState } from 'react';
import Login from './components/Login';
import Quiz from './components/Quiz';
import './App.css';

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (username) => {
   
    setLoggedInUser(username);
  
    console.log(`Logging in as ${username}`);
  };

  return (
    <div className="App">
      {!loggedInUser ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Quiz user={loggedInUser} />
      )}
    </div>
  );
};

export default App;
