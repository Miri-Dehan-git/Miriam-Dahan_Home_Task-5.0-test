const express = require("express");
const router = express.Router();
const Order = require("../Models/Orders");
const {
  addOrder,
  getAllOrders,
  getOrderBySupplierID
} = require("../Controllers/OrderController");

const authenticateToken = require("../middleware/authMiddleware"); // לספק
const authenticateOwnerToken = require("../middleware/authOwner"); // לבעל מכולת

// ✅ יצירת הזמנה - דורש טוקן של בעל מכולת
router.post('/', authenticateOwnerToken, addOrder);

// ✅ שליפת כל ההזמנות - רק בעל מכולת
router.get('/', authenticateOwnerToken, getAllOrders);

// ✅ שליפת הזמנות לפי מזהה ספק - רק לספק עצמו
router.get('/:_id', authenticateToken, async (req, res) => {
  const { _id } = req.params;

  if (req.user.supplierId !== _id) {
    return res.status(403).json({ message: "אין הרשאה לצפות בהזמנות של ספק אחר." });
  }

  try {
    const orders = await Order.find({ supplierId: _id });
    res.status(200).json(orders);
  } catch (error) {
    console.error("שגיאה בשליפת הזמנות:", error);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
});

// ✅ עדכון סטטוס ע"י ספק (דורש טוקן של ספק)
router.post("/approveOrderBySupplier/:_id", authenticateToken, async (req, res) => {
  const { _id } = req.params;

  try {
    const order = await Order.findById(_id);

    if (!order) {
      return res.status(404).json({ message: "הזמנה לא נמצאה" });
    }

    if (order.supplierId.toString() !== req.user.supplierId) {
      return res.status(403).json({ message: "אין הרשאה לעדכן את ההזמנה הזו" });
    }

    if (order.status === "ordered") {
      order.status = "in-progress";
    } else {
      return res.status(400).json({ message: "הזמנה אינה ניתנת לעדכון במצב הנוכחי" });
    }

    await order.save();
    res.status(200).json({ message: "סטטוס הזמנה עודכן", order });

  } catch (error) {
    console.error("שגיאה בעדכון הזמנה (ספק):", error);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
});

// ✅ עדכון סטטוס ע"י בעל מכולת (דורש טוקן של בעל מכולת)
router.post("/approveOrderByOwner/:_id", authenticateOwnerToken, async (req, res) => {
  const { _id } = req.params;

  try {
    const order = await Order.findById(_id);

    if (!order) {
      return res.status(404).json({ message: "הזמנה לא נמצאה" });
    }

    if (order.status === "in-progress") {
      order.status = "completed";
    } else {
      return res.status(400).json({ message: "הזמנה אינה ניתנת לעדכון במצב הנוכחי" });
    }

    await order.save();
    res.status(200).json({ message: "סטטוס הזמנה עודכן", order });

  } catch (error) {
    console.error("שגיאה בעדכון הזמנה (בעל מכולת):", error);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
});

module.exports = router;
