const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./userAuth");
const Equipment = require("../models/equipment");

// add Equipment
router.post("/add-equipment", authenticateToken, async (req, res) => {
    try{
        const {id} = req.headers;
        const user =  await User.findById(id);
        if(user.role !== "admin"){
            return  res.status(400).json({ message: "You are not having access to perform admin functions." });
        }

        const equipment = new Equipment({
            url: req.body.url,
            title: req.body.title,
            owner: req.body.owner,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        });

        await equipment.save();

        return res.status(200).json({message: "Equipment added successfully."});

    } catch (error){
       return res.status(500).json({ message: "Internal server error" });
    }
})

// update Equipment
router.put("/update-equipment", authenticateToken, async(req,res) =>{
    try{
        const {equipment_id} = req.headers;

        await Equipment.findByIdAndUpdate(equipment_id,{
            url: req.body.url,
            title: req.body.title,
            owner: req.body.owner,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        })

       return res.status(200).json({message: "Equipment updated successfully."});

    } catch (error){
       return res.status(500).json({ message: "Internal server error" });
    }
})

// Delete Equipment
router.delete("/delete-equipment", authenticateToken, async(req,res) =>{
    try{
        const {equipment_id} = req.headers;

        await Equipment.findByIdAndDelete(equipment_id);

        return res.status(200).json({message: "Equipment deleted successfully."});

    } catch (error){
       return res.status(500).json({ message: "Internal server error" });
    }
});

// Get all Equipments
router.get("/get-all-equipments", async(req,res) =>{
    try{

        const equipments = await Equipment.find().sort({createdAt: -1});

        return res.json({status: "Success",data:equipments});

    } catch (error){
       return res.status(500).json({ message: "Internal server error" });
    }
});


// Get recently added Equipments
router.get("/get-recent-equipments", async(req,res) =>{
    try{

        const equipments = await Equipment.find().sort({createdAt: -1}).limit(4);

        return res.json({status: "Success",data:equipments});

    } catch (error){
       return res.status(500).json({ message: "Internal server error" });
    }
});


// Get Equipment by Id
router.get("/get-equipment-by-id/:id", async(req,res) =>{
    try{

        const {id} = req.params;
        const equipment = await Equipment.findById(id);

        return res.json({status: "Success", data:equipment});

    } catch (error){
       return res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;

