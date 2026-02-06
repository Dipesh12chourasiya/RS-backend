const router = require("express").Router();
const User = require("../models/user");
const Equipment = require("../models/equipment");
const Order = require("../models/order");
const { authenticateToken } = require("./userAuth");

// place order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;

    for (const orderData of order) {
      const newOrder = new Order({ user: id, equipment: orderData._id });
      const orderDataFromDb = await newOrder.save();

      // Saving Order in user model
      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDb._id },
      });

      // clearing cart
      await User.findByIdAndUpdate(id, { $pull: { cart: orderData._id } });
    }

    return res.json({
      status: "Success",
      message: "Order Placed Successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
});

// get order history of particular user
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "equipment" },
    });
    // console.log("userOrders : " + userData.orders.equipment);
    const ordersData = userData.orders.reverse();
    return res.json({ status: "Success", data: ordersData });
  } catch (error) {
    return res.status(500).json({ message: "An Error occurred" });
  }
});

// get all orders admin
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const userData = await Order.find()
      .populate({
        path: "equipment",
      })
      .populate({
        path: "user",
      })
      .sort({ createdAt: -1 });

    return res.json({
      status: "Success",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({ message: "An Error occurred" });
  }
});

// update orders admin
router.put("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndUpdate(id, { status: req.body.status });

    return res.json({
      status: "Success",
      message: "Status Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "An Error occurred" });
  }
});

// get full user details (admin)
router.get("/admin/user/:id", authenticateToken, async (req, res) => {
  try {
    const adminId = req.headers.id;
    const admin = await User.findById(adminId);

    if (admin.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(req.params.id)
      .populate({
        path: "orders",
        populate: { path: "equipment" },
      });

    return res.json({ status: "Success", data: user });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// for dashboard of admin
router.get("/admin/stats", authenticateToken, async (req, res) => {
  try {
    const users = await User.countDocuments();
    const equipments = await Equipment.countDocuments();
    const orders = await Order.countDocuments();

    return res.json({
      users,
      equipments,
      orders,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
});

// filter orders
router.get("/admin/orders/:status", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ status: req.params.status })
      .populate("user")
      .populate("equipment");

    return res.json({ status: "Success", data: orders });
  } catch (error) {
    return res.status(500).json({ message: "Error" });
  }
});



module.exports =router;
