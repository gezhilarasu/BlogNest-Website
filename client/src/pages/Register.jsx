import React, {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import './Register.css';

function Register()
{
    const [name,setusername]=useState('');
    const [email,setemail]=useState('');
    const [password,setpassword]=useState('');
    const [confirmPassword,setconfirmPassword]=useState('');
    const navigate=useNavigate();
    const handlesubmit=async (e)=>{
        e.preventDefault();
        
        if(password!==confirmPassword){
            alert("Passwords do not match");
            return;
        }
        try{
                const response= await fetch('http://localhost:5000/api/auth/register',{
                    method:'POST', 
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({
                        name,
                        email,
                        password
                    }
                )
            
            });
            if(response.ok){
                alert("Registration successful");
                // Redirect to login or home page
                
                navigate('/otp', { state: { email } }); 
            }
            else{
                alert("Registration failed");
            }
        }
        catch(error){
            console.error("Error during registration:", error);
            alert("An error occurred during registration");
        }


    }
    return(
        
            <div className="register-header">
            <form onSubmit={handlesubmit}>
                <h2>Register</h2>
                <div className="form-group">
                    <label>Username:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setusername(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setemail(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label >Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setpassword(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Confirm Password:</label>
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        value={confirmPassword} 
                        onChange={(e) => setconfirmPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button className="register-button"type="submit">Register</button>
            </form>
            </div>
        
    )
}

export default Register;