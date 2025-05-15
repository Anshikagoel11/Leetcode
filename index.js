const express = require('express')
const main = require("./src/config/db")
const authRouter=require("./src/routes/userAuth");
const problemRouter = require("./src/routes/problemRouter")
const submitRouter = require("./src/routes/submitProblem")
const redisClient = require('./src/config/redis');
const cookieParser = require('cookie-parser');

const app = express();
require('dotenv').config();

//inbuild middleware
app.use(cookieParser());
app.use(express.json());


async function connection(){
try{
    await Promise.all[main(),redisClient.connect()]
    console.log('connected with db')
    app.listen(process.env.PORT,()=>{
        console.log('server is listening at some port number')
    })
}catch(err){
    console.log('error occured: ',err)
}
}
connection();



app.use("/user",authRouter);
app.use("/problem",problemRouter);
app.use("/submission",submitRouter);
