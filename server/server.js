const cors=require('cors');
const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');

dotenv.config();
mongoose.connect(process.env.MONGODB_KEY,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("MongoDB connected successfully");
}).catch((error)=>{
    console.error("MongoDB connection error:", error);
});
const app=express();
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your actual frontend URL and port
  credentials: true                // If you're using cookies or headers for auth
}));
app.use(express.json())

const authRoutes=require('./routes/auth');
const commentRoutes=require('./routes/comment');
const favoriteRoutes=require('./routes/favorite');
const likeRoutes=require('./routes/likes');
const postRoutes=require('./routes/post');


app.use('/api/auth',authRoutes);
app.use('/api/comment',commentRoutes);
app.use('/api/favoriate',favoriteRoutes);
app.use('/api/like',likeRoutes);
app.use('/api/post',postRoutes);


const PORT=process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})