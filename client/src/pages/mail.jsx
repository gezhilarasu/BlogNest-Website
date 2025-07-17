import React, {useState}from 'react';
import {useNavigate} from 'react-router-dom';
import './mail.css';

function Mail()
{
    const [email,setEmail]=useState('');
    const navigate=useNavigate();
    const token=localStorage.getItem('BlogNest_token');

    const handlesubmit=async(e)=>{
        e.preventDefault();

       const response=await fetch('https://blognest-website.onrender.com/api/auth/password_reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({
            email
          })
      });
      if(response.ok)
      {
        navigate('/newpassword',{ state: { email } });
      }
    }
    return(
        <div className="mail-page-container">
            <form onSubmit={handlesubmit}>
                <label>Mail</label>
                <input type="email"
                placeholder="Enter the email"
                        required
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                 ></input>
                 <button type="submit"className="mail-button">ENTER</button>
            </form>
        </div>
    )
}
export default Mail;