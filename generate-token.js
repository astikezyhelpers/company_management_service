import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const payload = {
    id: "user-uuid-here",
    email: "test@example.com", 
    name: "Test User"
};

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
console.log("JWT Token:", token);