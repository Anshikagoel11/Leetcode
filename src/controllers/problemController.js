const user = require("../models/user");
const Problem = require("../models/Problem");
const { checkMandatory } = require("../utils/validator");
const {getIdByLanguage,submitBatch,submitToken,statusIdValue} = require("../utils/ProblemUtlis");



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
      "codeFunction",
     "referenceSolution",
    
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

    const ques = await Problem.findOne({title:title});
    if(ques){
      return res.status(400).send("Problem already exists")
    }
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
        excepted_output : testcase.output,
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
//   }
// ]

const getResult = await submitToken(getToken);
//now getResult have this array 
//   "submissions": [
//     {
//       "language_id": 46,
//       "stdout": "hello from Bash\n",
//       "status_id": 3,
//       "stderr": null,
//       "token": "db54881d-bcf5-4c7b-a2e3-d33fe7e25de7"
//     },
//     {
//       "language_id": 71,
//       "stdout": "hello from Python\n",
//       "status_id": 3,
//       "stderr": null,
//       "token": "ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1"
//     }
//   ]


for(const {status_id} of getResult){
  if(status_id != 3){
     return res.status(400).send("No a valid data for Problem");
  }else{
    console.log("Accepted")
  }
}
//aur aese hi fronted m hidden testcases pr result dikhane ke leye aese kr skte ki -  agar response me 3 nhi aaya toh vhi request rko do fronted ke taraf se api p and ui p vhi hiddentest case no,uske value dekha do 
    }

    //now we can store in it our db
    req.body.problemCreater = req.user._id;
    await Problem.create(req.body);
    res.status(201).send("Problem added successfully")
    
  } catch (err) {
    res.status(400).send("Error occured: " + err);
  }
};


const updateProblem = async (req, res) => {
  try {
   
    const {id} = req.params;
   if(!id){
    return res.status(400).send("No id found")
   }

   const problem = await Problem.findById(id);
if(!problem){
  return res.status(500).send("No problem found")
}

    checkMandatory(
      req.body,
      "title",
      "description",
      "difficultyLevel",
      "tags",
      "visibleTestCases",
      "hiddenTestCases",
      "codeFunction",
     "referenceSolution",
    
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

    for (const { language, completeCode } of referenceSolution) {
      const languageId = getIdByLanguage(language);

      //create batch submission
      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        excepted_output : testcase.output,
      }));

      //now submit it code 
      const getToken = await submitBatch(submissions);

const getResult = await submitToken(getToken);


for(const {status_id} of getResult){
  if(status_id != 3){
     return res.status(400).send("No a valid data for Problem");
  }else{
    console.log("Accepted")
  }
}
    }

    //now we can store in it our db
    req.body.problemCreater = req.user._id;

    // Find the problem by ID and update it with validation
    const newProblem = await Problem.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run the validation before updating
    });

    res.status(200).json({
      message: "Problem updated successfully",
      problem: problem,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("Error occurred: " + err.message);
  }
}


const deleteProblem = async (req, res) => {
  try {

      const {id} = req.params;
   if(!id){
    return res.status(400).send("No id found")
   }

   const problem = await Problem.findById(id);
if(!problem){
  return res.status(500).send("No problem found")
}
    

    await Problem.findByIdAndDelete(id);

    res.status(204).send("Problem deleted successfully");
  } catch (err) {
    console.log(err);
    res.status(400).send("Error occurred: " + err.message);
  }
};


const getProblembyId = async (req, res) => {
  try {
     const {id} = req.params;
   if(!id){
    return res.status(400).send("No id found")
   }

   const problem = await Problem.findById(id).select('title description difficultyLevel hint tags constraints visibleTestCases codeFunction referenceSolution ');
if(!problem){
  return res.status(500).send("No problem found")
}

    const foundProblem = await Problem.findById(id);
    res.status(200).send(foundProblem);
  } catch (err) {
    res.status(400).send("error occured: " + err);
  }
};

const getAllProblem = async (req, res) => {
  try {
    const allProblem = await Problem.find({}).select('title difficultyLevel tags _id');
    if (!allProblem) {
      return res.send("No Problem found");
    }
    res.status(200).send(allProblem);
  } catch (err) {
    res.status(400).send("Error occured: " + err);
  }
};


const filterProblems = async (req, res) => {
  try {
    const { difficultyLevel, tags } = req.query;

    const filter = {};

    // Add difficultyLevel to filter if provided
    if (difficultyLevel) {
      filter.difficultyLevel = difficultyLevel;
    }

    // Add tags filter if provided (assumes tags are stored as an array in the DB)
    if (tags) {
      // Accept comma-separated string and convert it to array
      const tagsArray = tags.split(",").map((tag) => tag.trim());
      filter.tags = { $all: tagsArray }; // Match problems that include all specified tags
    }

    const filteredProblems = await Problem.find(filter).select('title difficultyLevel tags');

    if (filteredProblems.length === 0) {
      return res.status(404).send("No problems match the filter criteria.");
    }

    res.status(200).json(filteredProblems);
  } catch (err) {
    res.status(400).send("Error while filtering problems: " + err.message);
  }
};



module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblembyId,
  getAllProblem,
  filterProblems
};
