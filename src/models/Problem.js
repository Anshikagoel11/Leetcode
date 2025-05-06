const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ProblemSchema  = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficultyLevel: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  hint: {
    type: [String],
  },
  tags: {
    type: String,
    required: true,
  },
  constraints: {
    type: String,
  },
  visibleTestCases: [
    {
      input: { type: String, required: true },
      output: { type: String, required: true },
      explanation: { type: String, required: true }
    }
  ],
  hiddenTestCases: [
    {
      input: { type: String, required: true },
      output: { type: String, required: true }
    }
  ],
  codeFunction: [
    {
      language: { type: String, required: true },
      initialCode: { type: String, required: true }
    }
  ],
  problemCreater: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  referenceSolution:[
    {
      language:{
        type:String,
        required:true,
      },
      completeCode:{
        type:String,
        required:true,
      }
    }
  ]
}, {
  timestamps: true
});

const Problem = mongoose.model('Problem', ProblemSchema);
module.exports = Problem;
