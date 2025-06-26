const cors=require('cors');
const express=require('express');
const mongoose=require('mongoose');

const app=express();
app.use(cors());
app.use(express.json())



const PORT=process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})