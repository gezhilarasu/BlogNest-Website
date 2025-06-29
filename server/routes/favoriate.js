const express = require('express');
const router = express.Router();
const { addFavorite,deleteFavoriate,getFavoritePosts} = require('../controller/favoriteController');
const verifyToken = require('../middleware/verify_token');


router.post('/addFavoriate/:postId', verifyToken, addFavorite);
router.post('/removeFavoriate/:postId',verifyToken,deleteFavoriate);
route.get('/favoriate_post',verifyToken,getFavoritePosts);
module.exports = router;
