const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify_token');

const {
  createPost,
  deletePost,
  getPostsByuser,
  getPostById,
  getallposts
} = require('../controller/postcontroller');

// Create a post (authenticated)
router.post('/createpost', verifyToken, createPost);

// Delete a post by ID (authenticated)
router.delete('/deletepost/:id', verifyToken, deletePost);

// Get a single post by ID (no auth needed unless required)
router.get('/getpost/:id', getPostById);

// Get all posts (public view)
router.get('/allpost', getallposts);

// Get posts of the logged-in user (authenticated)
router.get('/mypost', verifyToken, getPostsByuser);

module.exports = router;
