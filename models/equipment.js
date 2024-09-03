// book.js

const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    isAvailable: { type: Boolean, default: true },
    language: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("equipments", equipmentSchema);
