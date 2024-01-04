const mongoose = require('mongoose');
require("dotenv").config();

// Connect to MongoDB
connectToDB(process.env.MONGO_URL)

async function connectToDB(url){
    try{
        await mongoose.connect(url);
        console.log("Connected to Database");
    }
    catch(error){
        console.log(`Db connection failed Error:${error}`)
    }
}

// Define schemas
const userSchema= new mongoose.Schema({
    username:{type:String, unique:true},
    password:String
});

const User = mongoose.model('User',userSchema)

const notesSchema = new mongoose.Schema({
    title:{type:String, unique:true},
    description:String,
    author:{type:mongoose.Schema.Types.ObjectId,ref:'User'},//storing the author of the note
    sharedUsers:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}]//array of users the note is shared with
});

notesSchema.index({title:"text",description:"text"})

const Notes = mongoose.model('Notes', notesSchema);

module.exports = {
    User:User,
    Notes:Notes
}