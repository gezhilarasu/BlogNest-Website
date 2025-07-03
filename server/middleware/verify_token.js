const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    console.log('Auth Header:', authHeader); // Debug log

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Received token:", token); // Debug log
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET); // Debug log

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded); // Debug log
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Token verification error:", err.message); // Debug log
        console.error("Error details:", err); // More detailed error
        res.status(403).json({ 
            message: "Invalid or expired token",
            error: err.message // Include error details for debugging
        });
    }
};

module.exports= verifyToken;