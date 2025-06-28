const {registerUser,verifyOtp_register,loginUser,password_reset,verify_otp_reset}=require('../controller/authcontroller');
const route=require('express').Router();
route.post('/register',registerUser);
route.post('/verify-otp-register',verifyOtp_register);
route.post('/login',loginUser);
route.post('/password_reset',password_reset);
route.post('/verify-otp-reset',verify_otp_reset);
module.exports=route;