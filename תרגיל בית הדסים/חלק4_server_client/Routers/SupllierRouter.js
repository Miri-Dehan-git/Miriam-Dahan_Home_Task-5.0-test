const express = require("express");
const router = express.Router();
const { 
  getAllSuppliers, 
  addSupplier, 
  loginSupplier, 
  registerSupplier 
} = require("../Controllers/SupplierController");

const authenticateSupplierToken = require("../middleware/authMiddleware");
const authenticateOwnerToken = require("../middleware/authOwner");

// ✅ יצירת ספק חדש – נניח שרק בעל מכולת יכול להוסיף ספקים
router.post('/', addSupplier);

// ✅ התחברות ספק – פתוח
router.post('/login', loginSupplier);

// ✅ הרשמה – פתוח
router.post('/register', registerSupplier);

// ✅ שליפת כל הספקים – רק בעל מכולת יכול לראות
router.get('/', authenticateOwnerToken, getAllSuppliers);
module.exports = router;
