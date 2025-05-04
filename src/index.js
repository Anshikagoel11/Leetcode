const express = require('express')
const main = require("./config/db")
const authRouter=require("./routes/userAuth");
const problemRouter=require("./routes/problemCreator")
const redisClient = require('./config/redis');
const cookieParser = require('cookie-parser');

const app = express();
require('dotenv').config();

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


