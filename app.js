const express = require("express");
const app = express();
require("dotenv").config();
require("./connention/conn");
const cors = require('cors');
const userRoute = require("./routes/user");
const equipmentRoute = require("./routes/equipment");

// Middlewares
app.use(express.json());
// Enable CORS
app.use(cors());

// Routes
// app.get("/" , (req,res)=>{
//     res.send("Hellow from backend");
// })
app.use("/api/v1" , userRoute);
app.use("/api/v1", equipmentRoute);

// creating port 
app.listen(process.env.PORT, () =>{
    console.log("Server Started at Port : " + process.env.PORT);
})

