const user = require("../models/user");
const Problem = require("../models/Problem");
const { checkMandatory } = require("../utils/validator");
const {getIdByLanguage,submitBatch} = require("../utils/ProblemUtlis");

const createProblem = async (req, res) => {
  try {
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

    const {
      title,
      description,
      difficultyLevel,
      hint,
      tags,
      constraints,
      visibleTestCases,
      hiddenTestCases,
      codeFunction,
      problemCreater,
      referenceSolution,
    } = req.body;

    //need-

    // source_code
    // language_id
    // stdin
    // excepted_output

    for (const { language, completeCode } of referenceSolution) {
      const languageId = getIdByLanguage(language);

      //batch format that we have to send to judge0

      // "submissions": [
      //   {
      //   "source_code": "#include<"hello, %s\n\", name);\n  return 0;\n}",
      //   "language_id": 150000,
      //   "stdin": "world",
      //   "expected_output": "hello, world"
      // }
      //   {
      //     "language_id": 71,
      //     "source_code": "print(\"hello from Python\")",
      //     "stdin":"w2d2",
      //     "excepted_output":'edcderw'
      //   }
      // ]

      //create batch submission
      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        excepted_output: testcase.output,
      }));

      //now submit it code 
      const getToken = await submitBatch(submissions);
      //getToken will have this
//       [
//   {
//     "token": "db54881d-bcf5-4c7b-a2e3-d33fe7e25de7"
//   },
//   {
//     "token": "ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1"
//   },
//   {
//     "token": "1b35ec3b-5776-48ef-b646-d5522bdeb2cc"
//   }
// ]

const getResult = await submitToken(getToken);


    }
  } catch (err) {
    res.status(400).send("Error occured: " + err);
  }
};


const updateProblem = async (req, res) => {
  try {
   
    const id = req.params.id;

    // Find the problem by ID and update it with validation
    const problem = await Problem.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
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

    res.status(204).send("Problem deleted successfully");
  } catch (err) {
    console.log(err);
    res.status(400).send("Error occurred: " + err.message);
  }
};


const getProblembyId = async (req, res) => {
  try {
    const id = req.params.id;
    const foundProblem = await Problem.findById(id);
    if (!foundProblem) {
      throw new Error("Problem not found");
    }
    res.status(200).send(foundProblem);
  } catch (err) {
    res.status(400).send("error occured: " + err);
  }
};

const getAllProblem = async (req, res) => {
  try {
    const allProblem = await Problem.find({});
    if (!allProblem) {
      return res.send("No Problem found");
    }
    res.status(200).send(allProblem);
  } catch (err) {
    res.status(400).send("Error occured: " + err);
  }
};

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblembyId,
  getAllProblem,
};
