const mongoose = require('mongoose')

const userSchema  = new mongoose.Schema({
firstName:{
    type:String,
    required:true,
    minLength:3,
    maxLength:20,
},
lastName:{
    type:String,
    minLength:3,
    maxLength:20,  
},
emailId:{
    type:String,
    required:true,  
    unique:true,
    trim:true,
    lowercase:true,
    immutable:true
},
password:{
    type:String,
    required:true,
},
role:{
    type:String,
   enum:['user','admin'],
   default:'user'
},
problemSolved:{
    type:[String]
},
},{
    timestamps:true
});

const user = mongoose.model('user',userSchema)

module.exports=user;