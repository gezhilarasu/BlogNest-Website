import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleLogin =async (e) => {
        e.preventDefault();
        const response=await fetch('https://blognest-website.onrender.com/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({
            email,
            password
          })
      });
      if(response.ok){
          const data=await response.json();
           console.log(data.token);
          localStorage.setItem('BlogNest_token', data.token);
          localStorage.setItem('BlogNest_username',email); // Store username
          navigate('/mainBlog'); 
      }
      else{
          alert("Login failed. Please check your credentials.");
      }
}
      const handleforget=async()=>{
        navigate('/mail');
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
        <button type="submit"onClick={handleforget} className="forget">Forgot your password?</button>
      </form>
    </div>
  );
}
export default Login;
