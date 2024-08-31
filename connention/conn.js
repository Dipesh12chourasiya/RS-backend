const mongoose = require("mongoose");

const conn = async () =>{
    try{
        await mongoose.connect(`${process.env.Mongo_Connection_String}`);
        console.log("Mongo DB Connected.")
    } catch(error){
        console.log(error);
    }
};
conn();
