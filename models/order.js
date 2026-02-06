const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user", 
    },
    equipment: {
      type: mongoose.Types.ObjectId,
      ref: "equipments", 
    },
    status: {
      type: String,
      default: "Order Placed",
      enum: ["Order Placed", "Out for Delivery", "Delivered", "Canceled"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
