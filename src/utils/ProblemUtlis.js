
const axios = require('axios');
require('dotenv').config();



const waitOneSec = async(time)=>{
    setTimeout(()=>{
      console.log('waiting for a second')
    },time)
}



const getIdByLanguage=(lang)=>{
    const languageWithId = {
        "c":50,
        "c++":54,
        "java":62,
        "javascript":63,
        "python":70,
        "rust":73
    }
    return languageWithId[lang.toLowerCase()];
}




const submitBatch = async (submissions )=>{

const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key': process.env.judge0_key,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

return await fetchData();
}




const submitToken = async (getToken)=>{
const tokens = getToken.map((obj)=>{
    return obj.token;
})
//now token is array of tokens 

const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: tokens.join(','),
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': process.env.judge0_key,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;

	} catch (error) {
		console.error(error);
	}
}


while(true){
const submitResult = await fetchData();
 //after submitResult will come in this format 
//{
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
// }

const result = submitResult.submissions.every((obj)=>obj.status_id>2)
if(result) return  submitResult.submissions;

await waitOneSec(1000);

}


}


const statusIdValue = (statusId)=>{
    const codeExecutionResult={
  4: "Wrong Answer",
  5: "Time Limit Exceeded",
  6: "Compilation Error",
  7: "Runtime Error (SIGSEGV)",
  8: "Runtime Error (SIGXFSZ)",
  9: "Runtime Error (SIGFPE)",
  10: "Runtime Error (SIGABRT)",
  11: "Runtime Error (NZEC)",
  12: "Runtime Error (Other)",
  13: "Internal Error",
  14: "Exec Format Error"
    }
    return codeExecutionResult[statusId];
}




module.exports={getIdByLanguage,submitBatch,submitToken,statusIdValue};