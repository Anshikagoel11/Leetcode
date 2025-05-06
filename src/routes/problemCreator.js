const express = require('express')
const problemRouter = express.Router();
const tokenVerifyMiddleware = require("../middleware/tokenverify")
const {createProblem,updateProblem,deleteProblem,getProblembyId,getAllProblem} = require("../controllers/problemController")
const adminmiddleware = require('../middleware/adminmiddleware')

//these 3 need admin access
problemRouter.post("/create", tokenVerifyMiddleware ,adminmiddleware, createProblem)
problemRouter.patch("/:id",tokenVerifyMiddleware,adminmiddleware,updateProblem)
problemRouter.delete("/:id",tokenVerifyMiddleware,adminmiddleware,deleteProblem)


problemRouter.get("/:id",tokenVerifyMiddleware,getProblembyId)
problemRouter.get("/",tokenVerifyMiddleware,getAllProblem)
// problemRouter.post("/user",tokenVerifyMiddleware,solvedProblem)
// problemRouter.get("/filter",filterProblem)


module.exports=problemRouter;

