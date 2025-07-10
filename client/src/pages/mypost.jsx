import { useNavigate } from 'react-router-dom';
import './mainBlog.css'; 
import {useState,useEffect} from 'react';
import './mypost.css'; // Ensure you have the correct path to your CSS file

function MyPosts() {
  const navigate = useNavigate();
  const [post,setPost]=useState([]);
  const [deleteLoading, setDeleteLoading] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://blognest-website.onrender.com/api/post/mypost', {
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

  // Function to delete a post
  const deletePost = async (postId) => {
    // Show confirmation dialog
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    console.log('Attempting to delete post with ID:', postId); // Add this line

    setDeleteLoading(prev => ({ ...prev, [postId]: true }));

    try {
      console.log('Sending DELETE request for post ID:', postId); // Add this line
      const response = await fetch(`https://blognest-website.onrender.com/api/post/deletepost/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('BlogNest_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Remove the deleted post from the state
        setPost(prevPosts => prevPosts.filter(p => p._id !== postId));
        alert('Post deleted successfully!');
      } else {
        const errorData = await response.json();
        console.error('Delete post error:', errorData); // <-- Add this line
        alert(`Failed to delete post: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert('An error occurred while deleting the post. Please try again.');
    } finally {
      setDeleteLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Function to calculate time ago with minutes, hours, days
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

  // Function to get category class for styling
  const getCategoryClass = (category) => {
    return category ? category.toLowerCase().replace(/\s+/g, '-') : 'general';
  };

  // Function to get image URL
// Fixed getImageUrl function to prevent infinite recursion
const getImageUrl = (imageData) => {
  // Early return for null/undefined
  if (!imageData) return null;
  
  try {
    // If it's already a string URL, return as is
    if (typeof imageData === 'string') {
      return imageData.startsWith('http') ? imageData : `https://blognest-website.onrender.com${imageData}`;
    }
    
    // Handle Buffer or binary data object
    if (imageData.data && imageData.contentType) {
      // Check if data is an array or has a data property
      const dataArray = Array.isArray(imageData.data) 
        ? imageData.data 
        : imageData.data.data || imageData.data;
      
      // Ensure we have a valid array
      if (!Array.isArray(dataArray)) {
        console.warn('Invalid image data format:', imageData);
        return null;
      }
      
      // Convert to base64 safely
      const uint8Array = new Uint8Array(dataArray);
      let binaryString = '';
      const chunkSize = 8192; // Process in chunks to avoid call stack issues
      
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.slice(i, i + chunkSize);
        binaryString += String.fromCharCode.apply(null, chunk);
      }
      
      const base64String = btoa(binaryString);
      return `data:${imageData.contentType};base64,${base64String}`;
    }
    
    // If imageData has a buffer property (Node.js Buffer)
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

  // Function to truncate content
  const truncateContent = (content, maxLength = 150) => {
    if (!content) return '';
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  const loadMorePosts = () => {
    console.log('Load more stories clicked');
    // Add your logic for loading more posts here
  };

  return (
     <>
     <div className="container">
      <div className="hero-header">
          <h1 className="hero-title-favorite">YourPost Stories</h1>
          <p className="hero-subtitle-favorite">
            This is the place here all your posts are saved.
          </p>
        </div>
          

          <main className="blog-grid" id="blogGrid">
              {post.length > 0 ? (
                post.map((postItem, index) => (
                  <article key={postItem._id || index} className="blog-card"
                  onClick={() => navigate('/postDetails',{ state: { postId: postItem._id } })}
                  >
                      <div className={`card-image ${getCategoryClass(postItem.category)}`}>
                          {(() => {
                            const imageUrl = getImageUrl(postItem.image);
                            return imageUrl ? (
                              <img 
                                src={imageUrl}
                                alt={postItem.title}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                                onError={(e) => {
                                  // Fallback if image fails to load
                                  e.target.style.display = 'none';
                                  e.target.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                                }}
                              />
                            ) : (
                              // Default gradient background if no image
                              <div style={{
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              }}></div>
                            );
                          })()}
                          <div className="image-overlay">
                              <span className="category-tag">
                                {postItem.category || 'General'}
                              </span>
                              {/* Delete button positioned in top-right corner */}
                              <button 
  className="delete-btn"
  onClick={(e) => {
    e.stopPropagation();
    deletePost(postItem._id);
  }}
  disabled={deleteLoading[postItem._id]}
  title="Delete this post"
  style={{
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'rgba(255, 59, 48, 0.9)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    cursor: deleteLoading[postItem._id] ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
    opacity: deleteLoading[postItem._id] ? 0.6 : 1
  }}
  onMouseEnter={(e) => {
    if (!deleteLoading[postItem._id]) {
      e.target.style.background = 'rgba(255, 59, 48, 1)';
      e.target.style.transform = 'scale(1.1)';
    }
  }}
  onMouseLeave={(e) => {
    if (!deleteLoading[postItem._id]) {
      e.target.style.background = 'rgba(255, 59, 48, 0.9)';
      e.target.style.transform = 'scale(1)';
    }
  }}
>
  {deleteLoading[postItem._id] ? '⌛' : '🗑️'}
</button>

                          </div>
                      </div>
                      <div className="card-content">
                          <h2 className="card-title">{postItem.title}</h2>
                          <p className="card-excerpt">
                              {truncateContent(postItem.content)}
                          </p>
                          <div className="card-meta">
                              <div className="likes-count">
                                ❤️ {postItem.likes?.length || 0} likes
                              </div>
                              <div className="views-count">
                                      👁️ {postItem.views || 0} views
                                  </div>
                              <div className="post-time">
                                {postItem.createdAt ? getTimeAgo(postItem.createdAt) : 'Recently'}
                              </div>
                          </div>
                      </div>
                  </article>
                ))
              ) : (
                <div className="no-posts">
                  <p>No posts available at the moment.</p>
                </div>
              )}
          </main>

          {post.length > 0 
          }
      </div></>
  );
}

export default MyPosts;