const express = require("express");
const app = express();
const userRouter = require("./routes/user");
const notesRouter = require("./routes/notes");
require("dotenv").config();

app.use(express.json())

app.use("/api/auth",userRouter);
app.use("/api/",notesRouter);

const PORT = process.env.PORT;
app.listen(PORT,()=>console.log(`Listening on port ${PORT}`));

module.exports = app;