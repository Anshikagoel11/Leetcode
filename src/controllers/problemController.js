const user = require("../models/user");
const Problem = require("../models/Problem");
const { checkMandatory } = require("../utils/validator");




const createProblem = async (req, res) => {
  try {
    if (req.user.role != "admin") {
      throw new Error("Only admin have access to create a Problem");
    }

    checkMandatory(
      req.body,
      "title",
      "description",
      "difficultyLevel",
      "tags",
      "visibleTestCases",
      "hiddenTestCases",
      "codeFunction"
    );

    const existing = await Problem.findOne({ title: req.body.title });
    if (existing) {
      throw new Error("Problem already exists");
    }

    req.body.problemCreater = req.user._id;
    const savedProblem = await Problem.create(req.body);

    res.status(201).json({
      message: "Problem created successfully",
      problem: savedProblem,
    });
  } catch (err) {
    res.status(400).send("Error occured: " + err);
  }
};


const updateProblem = async (req, res) => {
    try {
      if (req.user.role != "admin") {
        throw new Error("Only admin have access to update the Problem");
      }
  
      const id = req.params.id;
  
      // Find the problem by ID and update it with validation
      const problem = await Problem.findByIdAndUpdate(id, req.body, {
        new: true,           // Return the updated document
        runValidators: true, // Run the validation before updating
      });
  
      // Check if the problem exists
      if (!problem) {
        throw new Error("Problem not found");
      }
  
      res.status(200).json({
        message: "Problem updated successfully",
        problem: problem, // Send the updated problem back to the client
      });
  
    } catch (err) {
      console.log(err);
      res.status(400).send("Error occurred: " + err.message);
    }
  };
 

const deleteProblem = async (req, res) => {
    try {
      if (req.user.role != "admin") {
        throw new Error("Only admin can delete the Problem");
      }
  
      const id = req.params.id;
  
    
      const problem = await Problem.findByIdAndDelete(id);
  
      // Check if the problem exists
      if (!problem) {
        throw new Error("Problem not found");
      }
  
      res.status(204).send(
         "Problem deleted successfully",
      );
  
    } catch (err) {
      console.log(err);
      res.status(400).send("Error occurred: " + err.message);
    }
  };
  
const getProblem = async (req,res)=>{
try{
const id = req.params.id;
const foundProblem = await Problem.findById(id);
if(!foundProblem){
    throw new Error("Problem not found")
}
res.status(201).send(foundProblem);
}catch(err){
    res.status(400).send("error occured: " + err)
}
}

const getAllProblem = async(req,res)=>{
    try{
    const allProblem = await Problem.find({});
    if(!allProblem){
       return res.send("No Problem found")
    }
    res.status(201).send(allProblem);
    }catch(err){
    res.status(400).send('Error occured: '+err);
    }
}


module.exports = { createProblem, updateProblem,deleteProblem,getProblem,getAllProblem };
  
