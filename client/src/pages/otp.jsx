import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './otp.css';

export default function OTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const passedEmail = location.state?.email;
  const [email, setEmail] = useState(passedEmail || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');


  useEffect(() => {
  if (!email) {
    setError('Email is required to verify OTP.');
  }
}, [email]);

useEffect(() => {
  if (error) {
    const timeout = setTimeout(() => {
      navigate('/register');
    }, 3000); // wait 3 seconds before redirecting
    return () => clearTimeout(timeout);
  }
}, [error, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      const response = await fetch('https://blognest-website.onrender.com/api/auth/verify-otp-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        alert('Failed to verify OTP. Please try again.');
        return;
      }

      alert('OTP verified successfully! Registration complete.');
      navigate('/login'); // Redirect after success
    } catch (error) {
      console.error('OTP Verification error:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="otp-wrapper">
      <div className="otp-box">
        <div className="otp-icon">🔐</div>
        <h1 className="otp-title">Final Step: Verify Your Email</h1>
        <p className="otp-sub">Enter the OTP sent to <strong>{email}</strong> to complete your registration.</p>
        {error && <p className="custom-alert">{error}</p>}
        <div className="otp-form">
          <label className="otp-label">OTP Code</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="otp-input"
            placeholder="Enter OTP"
          />

          <button onClick={handleSubmit} className="register-otp-btn">
            Complete Registration
          </button>
        </div>
      </div>
    </div>
  );
}
