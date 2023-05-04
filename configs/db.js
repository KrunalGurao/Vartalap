// const mongoose = require('mongoose');

// const connection = async () =>{
//     try{
//         await mongoose.connect(process.env.MONGODB_URI);
//         console.log('Connection with MongoDB established');
//     }catch(err){
//         console.log('Something went wrong with Mongdb Connection');
//     }
// }
// module.exports = {
//     connection
// }

const mongoose = require("mongoose")
require("dotenv").config()
const connection = mongoose.connect(process.env.MONGODB_URI)

module.exports={connection}
