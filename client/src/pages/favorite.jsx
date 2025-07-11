import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './mainBlog.css'; 
import './favorite.css'; // Ensure you have the correct path to your CSS file
function Favorite() {
  const navigate = useNavigate();
  const [post, setPost] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://blognest-website.onrender.com/api/post/allpost', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('BlogNest_token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPost(data.posts || []);
        } else {
          console.error("Failed to fetch posts:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);
  useEffect(() => {
    const fetchFavoritePosts = async () => {
      try {
        const token = localStorage.getItem('BlogNest_token');
        const response = await fetch('https://blognest-website.onrender.com/api/favorite/favorite_post', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok) {
          setFavorites(data.posts); // 'posts' is already populated post data
        } else {
          console.error("Error fetching favorites:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchFavoritePosts();
  }, []);

  const getTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffTime = Math.abs(now - postDate);
    
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  };

  const getCategoryClass = (category) => {
    return category ? category.toLowerCase().replace(/\s+/g, '-') : 'general';
  };

  const getImageUrl = (imageData) => {
    if (!imageData) return null;
    
    try {
      if (typeof imageData === 'string') {
        return imageData.startsWith('http') ? imageData : `https://blognest-website.onrender.com${imageData}`;
      }

      if (imageData.data && imageData.contentType) {
        const dataArray = Array.isArray(imageData.data) 
          ? imageData.data 
          : imageData.data.data || imageData.data;
        
        if (!Array.isArray(dataArray)) {
          console.warn('Invalid image data format:', imageData);
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

      if (imageData.buffer && imageData.contentType) {
        const base64String = btoa(
          String.fromCharCode(...new Uint8Array(imageData.buffer))
        );
        return `data:${imageData.contentType};base64,${base64String}`;
      }

      console.warn('Unsupported image data format:', typeof imageData, imageData);
      return null;

    } catch (error) {
      console.error('Error processing image data:', error);
      return null;
    }
  };

  const truncateContent = (content, maxLength = 150) => {
    if (!content) return '';
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  return (
    <>
     
      <div className="container">
        <div className="hero-header">
          <h1 className="hero-title-favorite">Favorite Stories</h1>
          <p className="hero-subtitle-favorite">
            This is the place here all your favorite stories are saved.
          </p>
        </div>

        <main className="blog-grid" id="blogGrid">
  {favorites.length > 0 ? (
    favorites.map((postItem, index) => (
      <article
        key={postItem._id || index}
        className="blog-card"
        onClick={() => navigate('/postDetails',{ state: { postId: postItem._id } })}
        style={{ cursor: 'pointer' }}
      >
        <div className={`card-image ${getCategoryClass(postItem.category)}`}>
          {(() => {
            const imageUrl = getImageUrl(postItem.image);
            return imageUrl ? (
              <img 
                src={imageUrl}
                alt={postItem.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
            );
          })()}
          <div className="image-overlay">
            <span className="category-tag">{postItem.category || 'General'}</span>
          </div>
        </div>
        <div className="card-content">
          <h2 className="card-title">{postItem.title}</h2>
          <p className="card-excerpt">{truncateContent(postItem.content)}</p>
          <div className="card-meta">
            <div className="views-count">👁️ {postItem.views} views</div>
            <div className="likes-count">❤️ {postItem.likes} likes</div>
            <div className="post-time">{postItem.createdAt ? getTimeAgo(postItem.createdAt) : 'Recently'}</div>
          </div>
        </div>
      </article>
    ))
  ) : (
    <div className="no-posts">
      <p>No favorite posts found.</p>
    </div>
  )}
</main>

      </div>
    </>
  );
}

export default Favorite;
