import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Token_verify(){

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('blog_token');
        if (token) {
            console.log(token);
            // If token exists, redirect to Landing page
            navigate('/Blog');
        } else {
            // If no token, redirect to Login page
            navigate('/Landing');
        }
    }, [navigate]);

    return null; // This component does not render anything
}

export default Token_verify;