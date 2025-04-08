const {getAllSuppliers,addSupplier}=require("../Controllers/SupplierController")
const express=require("express")
const router =express.Router()
const Supplier=require("../Models/Supplier")

router.post('/',addSupplier)
router.get('/',getAllSuppliers)
router.post('/login', async (req, res) => {
    const {companyName,phone} = req.body;
  
    try {
      // חיפוש ספק לפי טלפון ושם חברה
      const supplier = await Supplier.findOne({companyName,phone});
  
      if (supplier) {
        // אם נמצא ספק תואם, נחזיר תשובה חיובית
        res.json({ success: true, message: 'Login successful', supplierId:supplier._id });
      } else {
        // אם לא נמצא ספק תואם
        res.json({ success: false, message: 'No matching supplier found' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
module.exports=router