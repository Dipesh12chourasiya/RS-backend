const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

// add Equipment
router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { equipment_id, id } = req.headers;
    const userData = await User.findById(id);

    const isBookINCart = userData.cart.includes(equipment_id);

    if (isBookINCart) {
      return res.json({
        status: "Success",
        message: "Equipment is already in cart",
      });
    }

    await User.findByIdAndUpdate(id, {
      $push: { cart: equipment_id },
    });

    return res.status(200).json({ message: "Equipment added to cart." });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// remove Equipments
router.put(
  "/remove-from-cart/:equipment_id",
  authenticateToken,
  async (req, res) => {
    try {
      const { equipment_id } = req.params;
      const { id } = req.headers;

      await User.findByIdAndUpdate(id, { $pull: { cart: equipment_id } });

      return res
        .status(200)
        .json({ message: "Equipment is removed from cart." });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error." });
    }
  }
);

//  get cart of a user
router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("cart");
    const cart = userData.cart.reverse();

    return res.json({ status: "Success", data: cart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An Error occurred" });
  }
});

module.exports = router;
