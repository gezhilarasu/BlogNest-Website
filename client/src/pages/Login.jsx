import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleLogin =async (e) => {
        e.preventDefault();
        const response=await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringfy({
            email,
            password
          })
      });
      if(response.ok){
          const data=await response.json();
          localStorage.setItem('BlogNest_token', data.token);
          navigate('/mainBlog'); 
      }
      else{
          alert("Login failed. Please check your credentials.");
      }
}

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Blog Login</h2>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <p className="forgot">Forgot your password?</p>
      </form>
    </div>
  );
}
export default Login;
