const mongoose =require('mongoose');

async function main(){
await mongoose.connect(process.env.mongoose_url);
// console.log('connected with database')
}

module.exports=main;