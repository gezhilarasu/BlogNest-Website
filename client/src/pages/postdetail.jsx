import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import Navbar from '../components/navbar';
import './postdetail.css';

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [favourited, setFavourited] = useState(false);

  const location = useLocation();
  const postId = location.state?.postId;
  console.log(`Post ID from state: ${postId}`);

  // Add refs for image container and content
  const imageContainerRef = useRef(null);
  const contentRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // Use URL param id first, fall back to location state
        const postIdentifier = id || postId;
        console.log(`Fetching post with ID: ${postIdentifier}`);
        
        if (!postIdentifier) {
          throw new Error('No post ID available');
        }
        
        const res = await fetch(`http://localhost:5000/api/post/getpost/${postIdentifier}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('BlogNest_token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!res.ok) {
          console.log("failed to fetch post");
          const errorData = await res.json().catch(() => ({}));
          console.error('API error response:', errorData);
          throw new Error(errorData.message || `Failed to fetch post: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log('Post data received:', data); // Debug log
        
        if (!data.post) {
          throw new Error('No post data returned from server');
        }
        
        setPost(data.post);
        
        // Handle likes data safely - fix for the "includes is not a function" error
        const userId = data.userId || localStorage.getItem('BlogNest_userId');
        
        // Ensure likes is an array before using includes
        const likesArray = Array.isArray(data.post.likes) 
          ? data.post.likes 
          : [];
        
        // Check if user ID is in likes array
        setLiked(userId ? likesArray.includes(userId) : false);
        
        // Similarly handle favorites safely
        const favoritesArray = Array.isArray(data.post.favourites) 
          ? data.post.favourites 
          : [];
        
        setFavourited(userId ? favoritesArray.includes(userId) : false);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.message || 'Failed to load post');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, postId]); // Include both possible sources of the post ID

  // Add effect to check content height vs image height
  useEffect(() => {
    if (post && !loading && imageContainerRef.current && contentRef.current && wrapperRef.current) {
      const checkContentHeight = () => {
        const imageHeight = imageContainerRef.current.clientHeight;
        const contentHeight = contentRef.current.clientHeight;
        
        if (contentHeight > imageHeight) {
          wrapperRef.current.classList.add('long-content');
        } else {
          wrapperRef.current.classList.remove('long-content');
        }
      };
      
      checkContentHeight();
      window.addEventListener('resize', checkContentHeight);
      
      return () => {
        window.removeEventListener('resize', checkContentHeight);
      };
    }
  }, [post, loading]);

  const toggleLike = async () => {
    try {
      // Use URL param id first, fall back to location state
      const postIdentifier = id || postId;
      
      if (!postIdentifier) {
        console.error('Cannot like post: No post ID available');
        return;
      }
      
      const res = await fetch(`http://localhost:5000/api/post/like/${postIdentifier}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('BlogNest_token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        setLiked(prev => !prev);
        setPost(prev => {
          if (!prev) return prev;
          
          // Ensure likes is an array
          const currentLikes = Array.isArray(prev.likes) ? prev.likes : [];
          const userId = localStorage.getItem('BlogNest_userId');
          
          return {
            ...prev,
            likes: liked
              ? currentLikes.filter(uid => uid !== userId)
              : [...currentLikes, userId]
          };
        });
      }
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const toggleFavourite = async () => {
    try {
      // Use URL param id first, fall back to location state
      const postIdentifier = id || postId;
      
      if (!postIdentifier) {
        console.error('Cannot favorite post: No post ID available');
        return;
      }
      
      const res = await fetch(`http://localhost:5000/api/post/favourite/${postIdentifier}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('BlogNest_token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        setFavourited(prev => !prev);
      }
    } catch (err) {
      console.error('Failed to favourite post:', err);
    }
  };

  // Helper function to process image data
  const getImageUrl = (imageData) => {
    if (!imageData) return null;
    
    try {
      if (typeof imageData === 'string') {
        return imageData.startsWith('http') ? imageData : `http://localhost:5000${imageData}`;
      }

      if (imageData.data && imageData.contentType) {
        const dataArray = Array.isArray(imageData.data) 
          ? imageData.data 
          : imageData.data.data || imageData.data;
        
        if (!Array.isArray(dataArray)) {
          return null;
        }

        const uint8Array = new Uint8Array(dataArray);
        let binaryString = '';
        const chunkSize = 8192;
        
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.slice(i, i + chunkSize);
          binaryString += String.fromCharCode.apply(null, chunk);
        }

        const base64String = btoa(binaryString);
        return `data:${imageData.contentType};base64,${base64String}`;
      }
      
      return null;
    } catch (error) {
      console.error('Error processing image data:', error);
      return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="post-details-container loading">
          <div className="loading-spinner"></div>
          <p>Loading post details...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="post-details-container error">
          <h2>Error loading post</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="back-button">
            Go Back
          </button>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="post-details-container not-found">
          <h2>Post Not Found</h2>
          <p>The post you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Home
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="post-details-container">
        <div className="post-header">
          <div className="post-meta">
            <span className="category">{post.category || 'General'}</span>
            <span className="author">By {post.author?.username || 'Anonymous'}</span>
            <span className="date">Published on {formatDate(post.createdAt)}</span>
          </div>
        </div>

        <div className="post-content-wrapper" ref={wrapperRef}>
          {post.image && (
            <div className="post-image-container" ref={imageContainerRef}>
              <img
                src={getImageUrl(post.image)}
                alt={post.title}
                className="post-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="post-details" ref={contentRef}>
            <h1 className="post-title">{post.title}</h1>
            <div className="post-content">
              {post.content?.split('\n').map((paragraph, idx) => (
                paragraph ? <p key={idx}>{paragraph}</p> : <br key={idx} />
              ))}
            </div>
          </div>
        </div>

        <div className="post-stats">
          <div className="views">👁️ {post.views || 0} views</div>
          <div className="comments">💬 {post.comments?.length || 0} comments</div>
          <div className="likes-count">❤️ {Array.isArray(post.likes) ? post.likes.length : 0} likes</div>
        </div>

        <div className="post-actions">
          <button onClick={toggleLike} className={`like-button ${liked ? 'liked' : ''}`}>
            {liked ? '❤️' : '🤍'} {Array.isArray(post.likes) ? post.likes.length : 0}
          </button>
          <button onClick={toggleFavourite} className={`favourite-button ${favourited ? 'favourited' : ''}`}>
            {favourited ? '⭐' : '☆'} Favourite
          </button>
          <button onClick={toggleFavourite} className={`command-button ${favourited ? 'favourited' : ''}`}>
            {favourited ? '⭐' : '☆'} Command
          </button>
          <button onClick={() => navigate(-1)} className="back-button">
            Back
          </button>
        </div>
      </div>
    </>
  );
}
