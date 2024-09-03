const router = require("express").Router();
const User = require("../models/user");

const { authenticateToken } = require("./userAuth");

// add book in the favorites
router.put("/add-equipment-to-favorite", authenticateToken, async (req, res) => {
  try {
    const { equipment_id, id } = req.headers;
    const userData = await User.findById(id);
    const isEquipmentFavorite = userData.favorites.includes(equipment_id);

    if (isEquipmentFavorite) {
      return res
        .status(200)
        .json({ message: "Equipment is already in favorites." });
    }
    await User.findByIdAndUpdate(id, {$push:{favorites: equipment_id}})
    return res.status(200).json({message: "Equipment added in favorites"});

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error." });
  }
});


// Delete from favorites
router.put("/remove-equipment-from-favorite", authenticateToken, async (req, res) => {
  try {
    const { equipment_id, id } = req.headers;
    const userData = await User.findById(id);
    const isEquipmentFavorite = userData.favorites.includes(equipment_id);

    if (isEquipmentFavorite) {
      await User.findByIdAndUpdate(id, {$pull:{favorites: equipment_id}})

    }
    
    return res.status(200).json({ message: "Equipment is removed from favorites." });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error." });
  }
});

// Get favorite equipments
router.get("/get-favorite-equipments", authenticateToken, async (req,res) => {
  try{
    const { id } = req.headers;
    const userData = await User.findById(id).populate("favorites");
    const favoriteEquipments = userData.favorites;
    return res.json({status:"Success",data:favoriteEquipments});
  }catch (error){
    console.log(error);
    return res.status(500).json({message: "An Error occurred"})
  }
})

module.exports = router;
