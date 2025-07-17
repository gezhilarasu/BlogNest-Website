import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import './postdetail.css';

const PostDetails = () => {
  const token = localStorage.getItem('BlogNest_token');
  const userId = token ? jwtDecode(token).id : null;

  const location = useLocation();
  const navigate = useNavigate();
  const postId = location.state?.postId;

  const [postDetails, setPostDetails] = useState(null);
  const [favoritePostIds, setFavoritePostIds] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [parentCommentId, setParentCommentId] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/post/getpost/${postId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setPostDetails(data.post);
        } else {
          console.error("Failed to fetch post details");
        }
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    const fetchFavorites = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/favorite/favorite_post', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          const favIds = data.posts.map(post => post._id);
          setFavoritePostIds(favIds);
        } else {
          console.error("Failed to fetch favorites");
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/comment/getcomment/${postId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setComments(data.comments);
        else console.error(data.message);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (postId) {
      fetchPostDetails();
      fetchFavorites();
      fetchComments();
    } else {
      navigate("/");
    }
  }, [postId, navigate, token]);

  const getImageBase64 = () => {
    const buffer = postDetails?.image?.data?.data;
    const contentType = postDetails?.image?.contentType;
    if (!buffer || !contentType) return null;
    try {
      const uint8Array = new Uint8Array(buffer);
      const base64String = btoa(uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), ''));
      return `data:${contentType};base64,${base64String}`;
    } catch (error) {
      console.error("Image conversion failed:", error);
      return null;
    }
  };

  const isFavorited = favoritePostIds.includes(postId);

  const handleToggleLike = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/like/toggleLikePost/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (response.ok) {
        const isLiked = postDetails.likedBy.includes(userId);
        setPostDetails(prev => ({
          ...prev,
          likes: result.likes,
          likedBy: isLiked
            ? prev.likedBy.filter(id => id !== userId)
            : [...prev.likedBy, userId]
        }));
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleToggleFavorite = async () => {
    const url = isFavorited
      ? `http://localhost:5000/api/favorite/removeFavorite/${postId}`
      : `http://localhost:5000/api/favorite/addFavorite/${postId}`;
    const method = isFavorited ? 'DELETE' : 'POST';
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (response.ok) {
        setFavoritePostIds(prev =>
          isFavorited ? prev.filter(id => id !== postId) : [...prev, postId]
        );
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleAddComment = async () => {
    if (!commentContent.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/api/comment/create-comment/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentContent, parentCommentId })
      });
      const data = await res.json();
      if (res.ok) {
        setCommentContent("");
        setParentCommentId(null);
        setComments(prev => [data.comment, ...prev]);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const renderComments = (commentList, depth = 0) => {
    return commentList.map(comment => (
      <div key={comment._id} className={`comment ${depth > 0 ? 'comment-reply' : ''}`} style={{
        marginLeft: depth > 0 ? `${depth * 1.2}rem` : '0'
      }}>
        <div className="comment-header">
          <span className="comment-author">{comment.userId?.name}</span>
          <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
        </div>
        <div className="comment-content">
          {comment.content}
        </div>

        <button
          className="reply-btn"
          onClick={() => setParentCommentId(prev => (prev === comment._id ? null : comment._id))}
        >
          {parentCommentId === comment._id ? "Cancel" : "Reply"}
        </button>

        {parentCommentId === comment._id && (
          <div className="reply-form">
            <textarea
              className="reply-textarea"
              placeholder="Write a reply..."
              value={commentContent}
              onChange={e => setCommentContent(e.target.value)}
              rows="2"
            />
            <button className="submit-reply-btn" onClick={handleAddComment}>Submit Reply</button>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="comment-replies">
            {renderComments(comment.replies, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  const imageSrc = getImageBase64();

  return (
      <div className="post-details-1">
          <h1 className="post-titles">{postDetails?.title}</h1>
          <div className="post-metas">
            <span className="post-categorys">{postDetails?.category}</span>
            <span className="post-dates">{new Date(postDetails?.createdAt).toLocaleDateString()}</span>
          </div>
        <div className="image-content">
        {imageSrc && (
          <div className="post-image-containers">
            <img
              src={imageSrc}
              alt="Post"
              className="post-images"
            />
          </div>
        )}

        <div className="post-contents">
          {postDetails?.content}
        </div>
        </div>

        <div className="post-actions">
          <div className="action-buttons">
            <button 
              className={`action-btn like-btn ${postDetails?.likedBy?.includes(userId) ? 'liked' : ''}`}
              onClick={handleToggleLike}
            >
              <span className="btn-icon">👍</span>
              <span className="btn-text">{postDetails?.likedBy?.includes(userId) ? "Liked" : "Like"}</span>
            </button>
            <button 
              className={`action-btn favorite-btn ${isFavorited ? 'favorited' : ''}`}
              onClick={handleToggleFavorite}
            >
              <span className="btn-icon">⭐</span>
              <span className="btn-text">{isFavorited ? "Unfavorite" : "Favorite"}</span>
            </button>
          </div>
          
          <div className="post-stats">
            <div className="stat-item">
              <span className="stat-label">Likes:</span>
              <span className="stat-value">{postDetails?.likes || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Views:</span>
              <span className="stat-value">{postDetails?.views}</span>
            </div>
          </div>
        </div>

        <div className="comments-section">
          <h3 className="comments-title">Comments ({comments.length})</h3>

          {parentCommentId === null && (
            <div className="comment-form">
              <textarea
                className="comment-textarea"
                placeholder="Write a comment..."
                value={commentContent}
                onChange={e => setCommentContent(e.target.value)}
                rows="3"
              />
              <button className="submit-comment-btn" onClick={handleAddComment}>
                Submit Comment
              </button>
            </div>
          )}

          <div className="comments-list">
            {comments.length > 0 ? renderComments(comments) : (
              <div className="no-comments">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default PostDetails;