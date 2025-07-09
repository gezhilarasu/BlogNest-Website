const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify_token');
const {
    createComment,
    getCommentsByPost,
    deleteComment,
    getCommentsByUser
} = require('../controller/commentcontroller');

router.post('/create-comment/:postId', verifyToken, createComment);
router.get('/getcomment/:postId',verifyToken, getCommentsByPost);
router.delete('/deletecomment/:id', verifyToken, deleteComment);
router.get('/getcomment-userId', verifyToken, getCommentsByUser);

module.exports = router;
