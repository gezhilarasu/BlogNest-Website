import React,{useState} from 'react';
import {useNavigate,useLocation} from 'react-router-dom';

function ResetPassword()
{
    const location = useLocation();
    const passedEmail = location.state?.email;
    const [email, setEmail] = useState(passedEmail || '');
    const [password,setpassword]=useState('');
    const [conformpassword,setconformPassword]=useState('');
    const [otp,setotp]=useState('');
    const navigate=useNavigate();

    

    const handlesubmit=async(e)=>{
        e.preventDefault();
        if(password!==conformpassword)
        {
            alert("password does not match");
        }

        const response=await fetch('http://localhost:5000/api/auth/verify-otp-reset',{
            method:'POST',
            headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email,password, otp }),
        });

        if(response.ok)
        {
            navigate('/login');
        }
        else{
            navigate('/mail');
        }

    }

    return(
        <div>
            <form onSubmit={handlesubmit}>
                <label>New Password</label>
                <input type='text'
                required
                placeholder="enter new password"
                value={password}
                onChange={(e)=>setpassword(e.target.value)}
                ></input>

                <label>Conform Password</label>
                <input type='text'
                required
                placeholder="enter conform password"
                value={conformpassword}
                onChange={(e)=>setconformPassword(e.target.value)}
                ></input>

                <label>Enter otp</label>
                <input type='text'
                required
                placeholder="enter otp"
                value={otp}
                onChange={(e)=>setotp(e.target.value)}
                ></input>
                <button type="submit">enter</button>

            </form>
        </div>
    )
}
export default ResetPassword;

