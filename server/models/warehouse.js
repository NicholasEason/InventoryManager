const mongoose = require("mongoose");

const warehouseInventorySchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    section: {
        type: String,
        required: true,
        trim: true
    }},
    {
        _id: true
    }
);

const warehouseSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    maxCapacity: {
      type: Number,
      required: true,
      min: 0,
    },
    inventory: {
      type: [warehouseInventorySchema],
      default: [],
    },
  },
  {
    timestamps: true
  }
);

const Warehouse = mongoose.model('Warehouse', warehouseSchema);
module.exports = Warehouse;