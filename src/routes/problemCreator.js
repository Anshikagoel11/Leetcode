const express = require('express')
const problemRouter = express.Router();
const tokenVerifyMiddleware = require("../middleware/tokenverify")
const {createProblem,updateProblem,deleteProblem,getProblem,getAllProblem} = require("../controllers/problemController")


//these 3 need admin access
problemRouter.post("/create", tokenVerifyMiddleware , createProblem)
problemRouter.patch("/:id",tokenVerifyMiddleware,updateProblem)
problemRouter.delete("/:id",tokenVerifyMiddleware,deleteProblem)


problemRouter.get("/:id",tokenVerifyMiddleware,getProblem)
problemRouter.get("/",tokenVerifyMiddleware,getAllProblem)
// problemRouter.post("/user",tokenVerifyMiddleware,solvedProblem)
// problemRouter.get("/filter",filterProblem)


module.exports=problemRouter;

