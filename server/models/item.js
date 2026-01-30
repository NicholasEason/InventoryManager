const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
        type: String,
        required: false
    },
  },
  {
    timestamps: true
  }
);

const Item = mongoose.model('Item', itemSchema);
module.exports = {Item};