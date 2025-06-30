const {User,PendingUser,Post,Favorite,Comment}=require('../models/models');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const nodemailer=require('nodemailer');
require('dotenv').config();


const registerUser=async(req,res)=>{
    const {name,email,password}=req.body;
    console.log("Registering user:", { name, email });
    try{
        const existingUser=await User.findOne({email});

        if(existingUser)
        {
            return res.status(400).json({message:"User already exists"});
        }

        const hashedPassword=await bcrypt.hash(password,10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("OTP:", otp);

        const pendingUser = new PendingUser({
                name,
                email,
                password: hashedPassword,
                otp,
                otpExpiresAt: Date.now() + 2 * 60 * 1000 // 2 minutes
        });
        pendingUser.save();

        const transport=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.EMAIL,
                pass:process.env.PASSWORD
            }
        });
        const mailOptions={
            from:process.env.EMAIL,
            to:email,
            subject:'Verify your email',
            text:`Your OTP is ${otp}. It is valid for 2 minutes.`
        }
        await transport.sendMail(mailOptions); 

        return res.status(200).json({message:"Otp is send successfully, please verify your email"});

    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }
}

const verifyOtp_register = async (req, res) => {
  const {otp,email}  = req.body;
  console.log("Verifying OTP for email:", email);
  console.log("Received OTP:", otp);
  try {
    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser)
      return res.status(400).json({ message: "No pending user found" });

    if (pendingUser.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    const newUser = new User({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password
    });

    await newUser.save();
    await PendingUser.deleteOne({ email });

    return res.status(201).json({ message: "User verified and registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



const loginUser=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const existingUser=await User.findOne({email});
        if(!existingUser)
        {
            return res.status(400).json({message:"User does not exist"})
        }
        const passwordMatch=await bcrypt.compare(password,existingUser.password);
        if(!passwordMatch)
        {
            return res.status(400).json({message:"Password is incorrect"})
        }
        const BlogNest_Token=jwt.sign(
            {
            id:existingUser._id,
            email:existingUser.email
            },
            process.env.JWT_SECRET,{expiresIn:'10'})
        console.log("BlogNest_Token:",BlogNest_Token);
        return res.status(200).json({message:"Login successful",token:BlogNest_Token});
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }
}

const password_reset = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

    existingUser.otp = otp;
    existingUser.otpExpiry = otpExpiry;
    await existingUser.save();

    console.log(`OTP for ${email} is ${otp}`);

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
        });
    const mailOptions = {from: process.env.EMAIL, to: email, subject: 'Password Reset OTP', text: `Your OTP for password reset is ${otp}. It is valid for 2 minutes.` };        
    await transport.sendMail(mailOptions);

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Error in password reset:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const verify_otp_reset = async (req, res) => {
  const { email,password,otp } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user.otp,user.otpExpiry);
    console.log(otp);

    if (!user || !user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: "Invalid request or no OTP found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    if (user.otpExpires < new Date()) {
        user.otp = null;
        user.otpExpires = null;
        await user.save();
      return res.status(400).json({ message: "OTP expired" });
    }

    user.otp = null;
    user.otpExpires = null;
    user.password = await bcrypt.hash(password, 10); // Hash the new password
    await user.save();
    

    return res.status(200).json({ message: "OTP verified, Password reset successfully" });
  } catch (err) {
    console.error("OTP verification error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteUserAccount = async (req, res) => {
  const userId = req.user.userId;

  try {
    // 1. Delete user's posts
    await Post.deleteMany({ userId });

    // 2. Delete user's comments
    await Comment.deleteMany({ userId });

    // 3. Delete user's favorites (likes)
    await Favorite.deleteMany({ userId });

    // 4. Finally, delete the user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "Account and all related data deleted" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports={registerUser,loginUser,verifyOtp_register,password_reset,verify_otp_reset,deleteUserAccount};

