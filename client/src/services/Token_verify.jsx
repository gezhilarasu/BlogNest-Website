import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Token_verify(){

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('BlogNest_token');
        if (token) {
            console.log(token);
            // If token exists, redirect to Landing page
            navigate('/mainBlog');
        } else {
            // If no token, redirect to Login page
            navigate('/Landing');
        }
    }, [navigate]);

    return null;
}

export default Token_verify;