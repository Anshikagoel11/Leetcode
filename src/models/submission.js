const mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true
    },
    problemId:{
        type:mongoose.Types.ObjectId,
        ref:"Problem",
        required:true
    },
    code:{
        type:String,
        required:true
    },
    title:{
         type:String,
    },
    language:{
         type:String,
        required:true,
        enum:['c','c++','java','javascript','python','rust']
    },
    status:{
        type:String,
        required:true,
        default:'pending'
    },
   runtime:{
        type:Number,
        default:0
    },
    memory:{
        type:Number, //KB
        default:0
    },
    errorMessage:{
        type:String,
        default:''
    },
    testCasesPassed:{
        type:Number,
        default:0
    },
    testcasesTotal:{
      type:Number,
      default:0
    }
},{timestamps:true})


const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;