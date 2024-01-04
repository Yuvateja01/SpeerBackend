const jwt = require("jsonwebtoken");
require("dotenv").config();

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
    res.status(403).send("Authorization Token missing");
    else{
    const token = authHeader.split(" ")[1];
    const isVaild = jwt.verify(token,process.env.SECRET_KEY);
    if(isVaild)
    next();
    else
    res.send("Incorrect/Expired auth token");
    }
}

module.exports = authMiddleware;