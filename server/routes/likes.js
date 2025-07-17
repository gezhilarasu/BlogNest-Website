const express=require('express');
const route=express.Router();
const verifyToken=require('../middleware/verify_token');

const { toggleLikePost } = require('../controller/likescontroller');

route.put('/toggleLikePost/:postId',verifyToken,toggleLikePost);
module.exports=route;

