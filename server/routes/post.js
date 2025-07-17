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

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });
module.exports = upload;

// Create a post (authenticated)
router.post('/createpost', verifyToken,upload.single('image'),createPost);

// Delete a post by ID (authenticated)
router.delete('/deletepost/:postId', verifyToken, deletePost);

// Get a single post by ID (no auth needed unless required)
router.get('/getpost/:postId',verifyToken,getPostById);

// Get all posts (public view)
router.get('/allpost',verifyToken, getallposts);

// Get posts of the logged-in user (authenticated)
router.get('/mypost', verifyToken, getPostsByuser);

module.exports = router;
