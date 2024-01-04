const jwt = require("jsonwebtoken");

let numberOfRequestsForUser = {};

function rateLimiter(req,res,next){
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const username = jwt.decode(token).username;
    if(numberOfRequestsForUser[username] == null){
        numberOfRequestsForUser[username] = 1;
        next();   
    }
    else if(numberOfRequestsForUser[username]<20){
       numberOfRequestsForUser[username]+=1;
       next(); 
    }
    else{
        res.status(403).send("No of Requests per min exceeded");
    }
}

setInterval(()=>{
    numberofRequestsForUser={}
},60000)

module.exports = rateLimiter