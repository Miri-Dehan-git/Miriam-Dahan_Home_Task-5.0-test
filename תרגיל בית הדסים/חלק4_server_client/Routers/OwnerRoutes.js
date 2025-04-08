const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const Owner = require('../Models/Owner');
const SECRET = "secretKeyOwner"; // חשוב להחליף ל-ENV במערכת אמיתית

const authenticateOwnerToken = require('../middleware/authOwner'); // ✅ הוספת אימות טוקן

// ✅ התחברות של בעל מכולת – לא דורשת טוקן
router.post('/login', async (req, res) => {
  try {
    // נבדוק אם קיים בעל מכולת
    let owner = await Owner.findOne();

    // אם לא קיים – ניצור אחד
    if (!owner) {
      owner = await Owner.create({
        name: "ברירת מחדל",
        email: "owner@store.com"
      });
      console.log("👤 נוצר משתמש בעל מכולת ברירת מחדל");
    }

    // ניצור טוקן
    const token = jwt.sign({ ownerId: owner._id }, SECRET, { expiresIn: '1h' });

    res.json({ success: true, token });
  } catch (error) {
    console.error("שגיאה בהתחברות:", error);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
});


// ✅ דוגמה לנתיב מאובטח לבעל מכולת בלבד:
router.get('/profile', authenticateOwnerToken, async (req, res) => {
  try {
    const owner = await Owner.findById(req.ownerId);
    if (!owner) {
      return res.status(404).json({ message: "בעל מכולת לא נמצא" });
    }

    res.json({ owner });
  } catch (error) {
    console.error("שגיאה בקבלת פרופיל:", error);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
});

module.exports = router;
