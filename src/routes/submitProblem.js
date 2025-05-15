const express = require('express')
const submitRouter = express.Router();
const tokenVerifyMiddleware = require("../middleware/tokenverify")
const {submitProblems} = require("../controllers/submitController")



submitRouter.post("/submit/:id" , tokenVerifyMiddleware , submitProblems);


module.exports=submitRouter;