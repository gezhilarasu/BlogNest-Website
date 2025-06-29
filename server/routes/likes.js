const express=require('express');
const route=express.Router();
const verifyToken=require('../middleware/verify_token');

const { incrementLike } = require('../controller/likescontroller');

route.patch('/likeincrement/:id',verifyToken,incrementLike);
module.exports=route;

