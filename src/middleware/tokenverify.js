const jwt = require('jsonwebtoken');
const user = require('../models/user'); 
const redisClient = require('../config/redis');
require('dotenv').config();

async function tokenVerifyMiddleware(req, res, next) {
    try {
        const { token } = req.cookies;
        if (!token) return res.status(401).send('No token provided');


            const isBlocked = await redisClient.exists(`token:${token}`);
            if(isBlocked) throw new Error('Token expires');
            
        const payload = jwt.verify(token, process.env.jwt_secret_key);
       

        const foundUser = await user.findById(payload._id); 
        if (!foundUser) return res.status(401).send('Invalid token');

        req.user = foundUser; // Attach user info
        next();
    } catch (err) {
        console.log(err.message);
        res.status(400).send('Invalid or expired token');
    }
}


module.exports=tokenVerifyMiddleware
