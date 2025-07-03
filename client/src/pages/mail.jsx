import React, {useState}from 'react';
import {useNavigate} from 'react-router-dom';

function Mail()
{
    const [email,setEmail]=useState('');
    const navigate=useNavigate();
    const token=localStorage.getItem('BlogNest_token');

    const handlesubmit=async(e)=>{
        e.preventDefault();

       const response=await fetch('http://localhost:5000/api/auth/password_reset', {
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
        <div>
            <form onSubmit={handlesubmit}>
                <label>Mail</label>
                <input type="email"
                placeholder="Enter the email"
                        required
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                 ></input>
                 <button type="submit">ENTER</button>
            </form>
        </div>
    )
}
export default Mail;