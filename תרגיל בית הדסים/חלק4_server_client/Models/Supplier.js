const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  minQuantity: Number
});

const supplierSchema = new mongoose.Schema({
  companyName: String,
  phone: String,
  representativeName: String,
  products: [productSchema]  // שדה המוצרים יהיה מערך של אובייקטים מהסוג productSchema
});

module.exports = mongoose.model('Supplier', supplierSchema);
