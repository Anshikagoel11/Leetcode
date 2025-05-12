const express = require('express')
const problemRouter = express.Router();
const tokenVerifyMiddleware = require("../middleware/tokenverify")
const {createProblem,updateProblem,deleteProblem,getProblembyId,getAllProblem,filterProblems} = require("../controllers/problemController")
const adminmiddleware = require('../middleware/adminmiddleware')




//these 3 need admin access
problemRouter.post("/create", tokenVerifyMiddleware ,adminmiddleware, createProblem)
problemRouter.put("/update/:id",tokenVerifyMiddleware,adminmiddleware,updateProblem)
problemRouter.delete("/delete/:id",tokenVerifyMiddleware,adminmiddleware,deleteProblem)




problemRouter.get("/problemById/:id",tokenVerifyMiddleware,getProblembyId)
problemRouter.get("/getAllProblem",tokenVerifyMiddleware,getAllProblem)
// problemRouter.post("/ProblemSolvedByUser",tokenVerifyMiddleware,solvedProblemByUser)
problemRouter.get("/filter", filterProblems);



module.exports=problemRouter;

