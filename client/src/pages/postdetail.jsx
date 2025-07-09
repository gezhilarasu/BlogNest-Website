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
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  
  // Command feature states
  const [showCommandBox, setShowCommandBox] = useState(false);
  const [command, setCommand] = useState('');
  const [commandSending, setCommandSending] = useState(false);
  const [commandMessage, setCommandMessage] = useState('');

  const location = useLocation();
  const postId = location.state?.postId;
  
  // Add refs for image container and content
  const imageContainerRef = useRef(null);
  const contentRef = useRef(null);
  const wrapperRef = useRef(null);
  const commandInputRef = useRef(null);

  // Get current user ID helper function
  const getCurrentUserId = () => {
    return localStorage.getItem('BlogNest_userId') || 
           localStorage.getItem('BlogNest_username') || 
           null;
  };

  // Function to count total likes for a post from localStorage
  const countLikesFromLocalStorage = (postIdentifier) => {
    let likeCount = 0;
    
    // Get all localStorage keys
    const keys = Object.keys(localStorage);
    
    // Filter keys that match the like pattern for this post
    const likeKeys = keys.filter(key => 
      key.startsWith(`like_${postIdentifier}_`) && 
      key !== `like_${postIdentifier}_undefined` &&
      key !== `like_${postIdentifier}_null`
    );
    
    // Count how many are set to 'true'
    likeKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value === 'true') {
        likeCount++;
      }
    });
    
    return likeCount;
  };

  // Function to get user's like status from localStorage
  const getUserLikeStatus = (postIdentifier, userId) => {
    if (!userId) return false;
    const likeKey = `like_${postIdentifier}_${userId}`;
    const value = localStorage.getItem(likeKey);
    return value === 'true';
  };

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const postIdentifier = id || postId;
        
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
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch post: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (!data.post) {
          throw new Error('No post data returned from server');
        }
        
        setPost(data.post);
        
        // Count likes from localStorage instead of server
        const localLikeCount = countLikesFromLocalStorage(postIdentifier);
        setLikeCount(localLikeCount);
        
        const userId = getCurrentUserId();
        if (userId) {
          // Get user's like status from localStorage
          const userLikeStatus = getUserLikeStatus(postIdentifier, userId);
          setLiked(userLikeStatus);
        }
        
        // Set favorite data from localStorage
        const userId2 = getCurrentUserId();
        if (userId2) {
          const favoriteKey = `favorite_${postIdentifier}_${userId2}`;
          const favoriteValue = localStorage.getItem(favoriteKey);
          setFavourited(favoriteValue === 'true');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.message || 'Failed to load post');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, postId]);

  // Content height check effect
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
      
      return () => window.removeEventListener('resize', checkContentHeight);
    }
  }, [post, loading]);

  // Focus command input when opened
  useEffect(() => {
    if (showCommandBox && commandInputRef.current) {
      commandInputRef.current.focus();
    }
  }, [showCommandBox]);

  // Simplified like function
  const toggleLike = async () => {
    const userId = getCurrentUserId();
    
    if (!userId) {
      alert('Please log in to like posts.');
      return;
    }

    const postIdentifier = id || postId;
    if (!postIdentifier) {
      console.error('No post ID available');
      return;
    }

    // Prevent multiple simultaneous requests
    if (likeLoading) return;
    
    setLikeLoading(true);
    
    try {
      // Toggle like status in localStorage
      const likeKey = `like_${postIdentifier}_${userId}`;
      const currentLikeStatus = localStorage.getItem(likeKey) === 'true';
      const newLikeStatus = !currentLikeStatus;
      
      // Update localStorage
      localStorage.setItem(likeKey, newLikeStatus.toString());
      
      // Update UI immediately
      setLiked(newLikeStatus);
      
      // Recalculate total like count from localStorage
      const newLikeCount = countLikesFromLocalStorage(postIdentifier);
      setLikeCount(newLikeCount);
      
      // Optional: Try to sync with server (but don't wait for response)
      try {
        const res = await fetch(`http://localhost:5000/api/post/like/${postIdentifier}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('BlogNest_token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: userId,
            action: newLikeStatus ? 'like' : 'unlike'
          })
        });
        
        if (res.ok) {
          console.log('Like synced with server successfully');
        } else {
          console.warn('Server sync failed, but localStorage updated');
        }
      } catch (serverError) {
        console.warn('Server sync failed, but localStorage updated:', serverError);
      }
      
    } catch (err) {
      console.error('Like operation failed:', err);
      
      // Rollback localStorage changes on error
      const likeKey = `like_${postIdentifier}_${userId}`;
      const originalStatus = !liked;
      localStorage.setItem(likeKey, originalStatus.toString());
      
      // Rollback UI changes
      setLiked(originalStatus);
      const rolledBackCount = countLikesFromLocalStorage(postIdentifier);
      setLikeCount(rolledBackCount);
      
      alert('Unable to update like. Please try again.');
    } finally {
      setLikeLoading(false);
    }
  };

  const toggleFavourite = async () => {
    const userId = getCurrentUserId();
    
    if (!userId) {
      alert('Please log in to favourite posts.');
      return;
    }

    const postIdentifier = id || postId;
    if (!postIdentifier) {
      console.error('No post ID available');
      return;
    }

    try {
      // Toggle favorite status in localStorage
      const favoriteKey = `favorite_${postIdentifier}_${userId}`;
      const currentFavoriteStatus = localStorage.getItem(favoriteKey) === 'true';
      const newFavoriteStatus = !currentFavoriteStatus;
      
      // Update localStorage
      localStorage.setItem(favoriteKey, newFavoriteStatus.toString());
      
      // Update UI immediately
      setFavourited(newFavoriteStatus);
      
      // Optional: Try to sync with server (but don't wait for response)
      try {
        const endpoint = currentFavoriteStatus 
          ? `http://localhost:5000/api/post/favorite/removefavorite/${postIdentifier}`
          : `http://localhost:5000/api/post/favorite/addfavorite/${postIdentifier}`;
        
        const method = currentFavoriteStatus ? 'DELETE' : 'POST';
        
        const res = await fetch(endpoint, {
          method: method,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('BlogNest_token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (res.ok) {
          console.log('Favorite synced with server successfully');
        } else {
          console.warn('Server sync failed, but localStorage updated');
        }
      } catch (serverError) {
        console.warn('Server sync failed, but localStorage updated:', serverError);
      }
      
    } catch (err) {
      console.error('Favourite operation failed:', err);
      
      // Rollback localStorage changes on error
      const favoriteKey = `favorite_${postIdentifier}_${userId}`;
      const originalStatus = !favourited;
      localStorage.setItem(favoriteKey, originalStatus.toString());
      
      // Rollback UI changes
      setFavourited(originalStatus);
      
      alert('Unable to update favourite. Please try again.');
    }
  };

  // Command functionality
  const toggleCommandBox = () => {
    setShowCommandBox(prev => !prev);
    setCommand('');
    setCommandMessage('');
  };

  const sendCommand = async () => {
    if (!command.trim()) {
      setCommandMessage('Please enter a command');
      return;
    }

    try {
      setCommandSending(true);
      setCommandMessage('');
      
      const postIdentifier = id || postId;
      
      if (!postIdentifier) {
        setCommandMessage('Error: No post ID available');
        return;
      }

      const authorData = post.author || {};
      const recipientId = authorData._id || authorData.id || '';
      
      const res = await fetch(`http://localhost:5000/api/post/comment/${postIdentifier}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('BlogNest_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: command.trim(),
          postId: postIdentifier,
          authorId: recipientId,
          userId: getCurrentUserId()
        })
      });

      if (res.ok) {
        setCommandMessage('Command sent successfully!');
        setCommand('');
        setTimeout(() => {
          setShowCommandBox(false);
          setCommandMessage('');
        }, 2000);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setCommandMessage(errorData.message || 'Failed to send command');
      }
    } catch (err) {
      console.error('Failed to send command:', err);
      setCommandMessage('Error sending command');
    } finally {
      setCommandSending(false);
    }
  };

  const handleCommandKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendCommand();
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
        
        if (!Array.isArray(dataArray)) return null;

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
          <div className="likes-count">❤️ {likeCount} likes</div>
        </div>

        <div className="post-actions">
          <button 
            onClick={toggleLike} 
            className={`like-button ${liked ? 'liked' : ''} ${likeLoading ? 'loading' : ''}`}
            disabled={likeLoading}
          >
            {likeLoading ? '⏳' : (liked ? '❤️' : '🤍')} 
          </button>
          <button onClick={toggleFavourite} className={`favourite-button ${favourited ? 'favourited' : ''}`}>
            {favourited ? '⭐' : '☆'} Favourite
          </button>
          <button onClick={toggleCommandBox} className={`command-button ${showCommandBox ? 'active' : ''}`}>
            {showCommandBox ? '❌' : '⚡'} Command
          </button>
          <button onClick={() => navigate(-1)} className="back-button">
            Back
          </button>
        </div>

        {/* Command Box */}
        {showCommandBox && (
          <div className="command-box">
            <div className="command-box-header">
              <h3>Send Command to {post.author?.username || 'Author'}</h3>
              <button onClick={toggleCommandBox} className="close-command-box">×</button>
            </div>
            <div className="command-box-content">
              <textarea
                ref={commandInputRef}
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyPress={handleCommandKeyPress}
                placeholder="Enter your command here..."
                className="command-input"
                rows="4"
                disabled={commandSending}
              />
              <div className="command-box-actions">
                <button 
                  onClick={sendCommand} 
                  disabled={commandSending || !command.trim()}
                  className="send-command-button"
                >
                  {commandSending ? 'Sending...' : 'Send Command'}
                </button>
              </div>
              {commandMessage && (
                <div className={`command-message ${commandMessage.includes('successfully') ? 'success' : 'error'}`}>
                  {commandMessage}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}