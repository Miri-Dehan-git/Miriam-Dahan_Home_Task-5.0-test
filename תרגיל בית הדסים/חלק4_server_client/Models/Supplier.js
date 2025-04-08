const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  minQuantity: Number
});

const supplierSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  phone: { type: String, required: true },
  representativeName: { type: String, required: true },
  products: [productSchema]
}, {
  timestamps: true 
});

module.exports = mongoose.model('Supplier', supplierSchema);
