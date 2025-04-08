const mongoose = require('mongoose');
const Supplier = require('./Supplier');

const orderSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId,ref:"Supplier" },
    productName: String,
    quantity: Number,
    price: Number,
    status: {
      type: String,
      enum: [ "ordered", "in-progress", "completed"],
      default: "ordered"
    },  });

  module.exports=mongoose.model('Order',orderSchema)
