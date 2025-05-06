const express = require('express')
const authRouter = express.Router();
const {register,login,logout,profile,adminRegister} = require("../controllers/auth")
const tokenVerifyMiddleware = require("../middleware/tokenverify")
const adminmiddleware = require("../middleware/adminmiddleware")



authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',tokenVerifyMiddleware,logout);
authRouter.get('/profile',tokenVerifyMiddleware,profile);
authRouter.post('/admin/register',tokenVerifyMiddleware,adminmiddleware,adminRegister)

module.exports=authRouter;