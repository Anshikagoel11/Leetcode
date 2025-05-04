
const user = require('../models/user')
const {validate} = require('../utils/validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const redisClient = require('../config/redis');
require('dotenv').config();


const register = async(req,res)=>{
   try{
   validate(req.body);

   const {emailId,password}=req.body;
   
   if(await user.exists({emailId})){
   throw new Error('Invalid Email')
   }
   
   req.body.password=await bcrypt.hash(password,10);
    user.role='user';
   await user.create(req.body);

   //send token to user
  const token =  jwt.sign({emailId:emailId,_id:user._id,role:'user'}, process.env.jwt_secret_key,{expiresIn:60*60})
  res.cookie("token",token,{maxAge:60*60*1000}); //time in cookie here is given in ms
   res.status(201).send('user register successfully')

   }catch(err){
    res.status(400).send('Error occured: '+err);
     
   }
}

const login = async(req,res)=>{
   try{
    const {emailId,password}=req.body;
    if(!emailId || !password){
        throw new Error('Email or password is missing')
    }

    const foundUser  = await user.findOne({emailId});
    if(!foundUser) throw new Error('Invalid Credentials')

        const isMatched = await bcrypt.compare(password,foundUser.password);
        if(!isMatched) throw new Error('Invalid Credentials')

            const token =  jwt.sign({emailId:emailId,_id:foundUser._id,role:foundUser.role}, process.env.jwt_secret_key,{expiresIn:60*60})
            res.cookie("token",token,{maxAge:60*60*1000}); 

    res.status(200).send('login successfully')
   }
   catch(err){   
    res.status(400).send('Error occured: '+err);
   }
}

const logout = async(req,res)=>{
    try{
        const {token} = req.cookies;
    const payload=jwt.decode(token);
    
    await redisClient.set(`token:${token}` , "blocked");
    redisClient.expireAt(`token:${token}`,payload.exp);
    
    res.clearCookie('token',null,{expires:new Date(Date.now())});
    res.status(204).send('logout successfully')
}catch(err){
    res.status(400).send('Error occured: '+err)
}
}

const profile = async(req,res)=>{
   try{
    const user = req.user;
    res.status(200).send(user);
   }
    catch(err){
        res.status(400).send("Error occured")
    }
}

const adminRegister=async(req,res)=>{
    try{
        if(req.user.role!='admin'){
            throw new Error("Only admin have access")
        }
        validate(req.body);
     
        const {emailId,password}=req.body;
        
        if(await user.exists({emailId})){
        throw new Error('Invalid Email')
        }
        
        req.body.password=await bcrypt.hash(password,10);
       
        await user.create(req.body);
     
        //send token to user
       const token =  jwt.sign({emailId:emailId,_id:user._id,role:user.role}, process.env.jwt_secret_key,{expiresIn:60*60})
       res.cookie("token",token,{maxAge:60*60*1000}); //time in cookie here is given in ms
        res.status(201).send('register successfully')
     
        }catch(err){
         res.status(400).send('Error occured: '+ err);
          
        }
}


module.exports={register,login,logout,profile,adminRegister}