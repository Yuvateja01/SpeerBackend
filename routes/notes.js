const {Router} = require("express");
const router = Router();
const {Notes} = require("../db/index");
const {User} = require("../db/index");
const {createNote} = require("../validation");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");
const rateLimiter = require("../middleware/ratelimiter")
const zod = require("zod");
require("dotenv").config();



async function getUserId(authHeader){
    const token = authHeader.split(" ")[1];
    const username = jwt.decode(token).username;
    const findUserId = await User.findOne({username}).exec();
    return findUserId?findUserId._id:null;
}

async function getUserIdUsername(username){
    const findUserId = await User.findOne({username}).exec();
    return findUserId?findUserId._id:null;
}

router.use(authMiddleware);
router.use(rateLimiter);
router.post("/notes",async(req,res)=>{
    const title = req.body.title;
    const description = req.body.description;
    const noteObj = {
        title,
        description
    }
    const userId = await getUserId(req.headers.authorization);
    const success = createNote.safeParse(noteObj).success
    if(success && userId){
        try{
            const newNote = await Notes.create({title,description,author:userId,sharedUsers:[]});
            res.status(201).send("Note Created Successfully")
        }
        catch(error){
            res.status(400).send(`Failed to create Note ${error}`);
        }
    }
    else if(!success){
        res.status(400).send("Improper Note Format");
    }
    else{
        console.log(userId);
        res.status(401).send("Invalid Token/User");
    }
})


router.get("/notes",async(req,res)=>{
    const userId = await getUserId(req.headers.authorization);
    if(userId){
        const notes =  await Notes.find({author:userId}).exec();
        res.status(200).send(notes);
    }
    else{
        res.status(401).send("Invalid Token/User");
    }
})


router.get("/notes/:id",async(req,res)=>{
    const noteId = req.params.id;
    const userId = await getUserId(req.headers.authorization);
    if(userId){
        const note =  await Notes.findOne({_id:noteId,author:userId}).exec();
        res.status(200).send(note);
    }
    else if(!userId){
        res.status(401).send("Invalid Token/User");
    }
    else{
        res.status(404).send("Invalid Note Id");
    }

})

router.put("/notes/:id",async(req,res)=>{
    const noteId = req.params.id;
    const title = req.body.title;
    const description = req.body.description;
    const note = await Notes.findById(noteId);
    if(note){
        note.title = title;
        note.description = description;
        try{
            const result = note.save();
            res.status(200).send("Update Successful")
        }
        catch(error){
            res.status(500).send("Updated unsuccessful");
        }
    }
    else{
        res.status(404).send("Invalid Note Id")
    }
})


router.delete("/notes/:id",async(req,res)=>{
    const noteId = req.params.id;
    const deletedNote = await Notes.deleteOne({_id:noteId});
    if (deletedNote.deletedCount == 1)
    res.status(204).send("Deleted");
    else
    res.status(404).send("Invalid Note id")
})

router.post("/notes/:id/share",async(req,res)=>{
    const noteId = req.params.id;
    const sharedUsers = req.body.sharedUsers;
    let sharedUsersIds = [];
    Promise.all(sharedUsers.map(username=>getUserIdUsername(username))).then(results=>{
        sharedUsersIds = results.filter((i)=>i!= null)
    })
    const note = await Notes.findById(noteId);
    if(note){
        note.sharedUsers = sharedUsersIds
        await note.save();
        res.status(200).send("Updated Users")
    }
    else{
        res.status(404).send("Note with this ID not found");
    }
})

router.get("/notes/:id/share",async(req,res)=>{
    const noteId = req.params.id;
    const note = await Notes.findById(noteId);
    const userId = await getUserId(req.headers.authorization);
    if(note && userId){
        console.log(userId)
        console.log(note.author._id)
        const isSharedUser = note.sharedUsers.some(user=>user.equals(userId))
        if(userId.equals(note.author._id) || isSharedUser){
            res.status(200).send(note);
        }
        else{
            res.status(403).send("Unauthorized for this note")
        }
    }
    else if(!note){
        res.status(404).send("Incorrect Note ID");
    }
    else{
        res.status(401).send("Invalid Token/User");
    }

})

router.get("/search/",async(req,res)=>{
    const query = req.query.query;
    const notes = await Notes.find({$text:{$search:query}}).exec();
    res.status(200).send(notes);
})


module.exports = router