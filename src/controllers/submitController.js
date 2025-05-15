const submission = require("../models/submission");
const Problem = require("../models/Problem")
const { checkMandatory } = require("../utils/validator");
const {getIdByLanguage,submitBatch,submitToken,statusIdValue}= require("../utils/ProblemUtlis");



const submitProblems = async(req,res)=>{

try{

const userId = req.user._id;
const problemId = req.params.id;

const {code,language} = req.body;
if(!userId || !problemId || !code || !language){
    return res.status(400).send("Some filed missing");
}

//now fetch problem from db to get its title,testcases(hidden) etc
const problem  = await Problem.findById(problemId);
if(!problem){
    return res.status(400).send("No problem found");
}


const  submittedResult  = await submission.create({
    userId,
    problemId,
    code,
    status:"pending",
    language,
    testCasesPassed:0,
    testcasesTotal : problem.hiddenTestCases.length
})

//now we have submit code to judge0 with its format
 const languageId = getIdByLanguage(language);

   const submissions =problem.hiddenTestCases.map((testcase) => ({
        source_code: code,
        language_id: languageId,
        stdin: testcase.input,
        excepted_output : testcase.output,
      }));

         const getToken = await submitBatch(submissions);
         const getResult = await submitToken(getToken);

         //now update our submit result since we have result of judge0
         let testCasesPassed=0;
         let runtime=0;
         let memory=0;
         let allPassed = true;
         let status="accepted";
         let errorMessage=null;
         for(const onetestResult of getResult){
            console.log(onetestResult.status_id)
            if(onetestResult.status_id==3){
                testCasesPassed++;
                runtime = runtime+parseFloat(onetestResult.time);
                memory= Math.max(memory,onetestResult.memory)
            }else{
                 allPassed = false;
               status = statusIdValue(onetestResult.status_id);
               errorMessage=onetestResult.stderr;
            }
         }

         status=allPassed?"accepted":status;
         //now update data in db
         submittedResult.status=status;
         submittedResult.testCasesPassed=testCasesPassed;
         submittedResult.errorMessage=errorMessage;
         submittedResult.runtime=runtime;
         submittedResult.memory=memory;

         await submittedResult.save();

         res.status(201).send(submittedResult)

}
catch(err){
    res.status(500).send(err)
}
}

module.exports={submitProblems};