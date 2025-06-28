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
app.use(cors());
app.use(express.json())

const authRoutes=require('./routes/auth');

app.use('/api/auth',authRoutes);



const PORT=process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})