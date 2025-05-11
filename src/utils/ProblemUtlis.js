
const axios = require('axios');
require('dotenv').config();

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



const submitBatch = (submissions )=>{

const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'true'
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

return fetchData();
}


const submitToken = (getToken)=>{
const tokens = getToken.map((obj)=>{
    return obj.token;
})
//now token is array of tokens 


const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: tokens.join(','),
    base64_encoded: 'true',
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
        //after submission token result will come in this format 
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
	} catch (error) {
		console.error(error);
	}
}

fetchData();
}


module.exports={getIdByLanguage,submitBatch,submitToken};