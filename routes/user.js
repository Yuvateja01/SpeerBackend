const {Router} = require("express");
const router = Router();
const {User} = require("../db/index");
const {createUser} = require("../validation");
const jwt = require("jsonwebtoken");
const zod = require("zod");
require("dotenv").config();


router.post("/signup",async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const newUser = {
        username,
        password
    };
    const success = createUser.safeParse(newUser).success;
    if(success){
        const findUser = await User.findOne({username}).exec();
        if(findUser)
        res.status(400).send("Username already in use");
        else{
        try{
            const result = await User.create(newUser);
            res.status(201).send("User created successfully!");
        }
        catch(error){
            res.status(500).send(`Error creating user ${error}`);
        }
    }
    }
    else{
        res.status(400).send("Invalid format for Username/Password");
    }

})

router.post("/login",async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    try{
        const loggedUser = await User.findOne({username,password}).exec();
        if(!loggedUser)
            res.status(401).send("Authentication Failed.Wrong Credentials");
        else{
            const options = {
                expiresIn: "24h"
            }
            const token = jwt.sign({username},process.env.SECRET_KEY,options);
            res.status(200).send(`token:${token}`);
        }
    }
    catch(error){
        res.status(500).send(`Error returning token ${error}`);
    }
}) 

module.exports = router