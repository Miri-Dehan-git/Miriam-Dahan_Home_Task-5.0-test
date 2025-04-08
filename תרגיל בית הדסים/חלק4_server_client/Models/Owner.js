const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  username: String
});

module.exports = mongoose.model('Owner', ownerSchema);
