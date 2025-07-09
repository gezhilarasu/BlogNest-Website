const express = require('express');
const route = express.Router();
const { addFavorite,deleteFavorite,getFavoritePosts} = require('../controller/favoritecontroller');
const verifyToken = require('../middleware/verify_token');


route.post('/addFavorite/:postId', verifyToken, addFavorite);
route.delete('/removeFavorite/:postId',verifyToken,deleteFavorite);
route.get('/favorite_post',verifyToken,getFavoritePosts);
module.exports = route;
