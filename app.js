const express = require("express");
const app = express();
require("dotenv").config();
require("./connention/conn");


// Routes
app.get("/" , (req,res)=>{
    res.send("Hellow from backend");
})

// creating port 
app.listen(process.env.PORT, () =>{
    console.log("Server Started at Port : " + process.env.PORT);
})

