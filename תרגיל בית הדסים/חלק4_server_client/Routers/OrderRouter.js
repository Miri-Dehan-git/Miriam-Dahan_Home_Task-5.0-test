const express=require("express")
const router =express.Router()
const Order=require("../Models/Orders")
const {addOrder,getAllOrders,getOrderBySupplierID}=require("../Controllers/OrderController")

router.post('/',addOrder)
router.get('/',getAllOrders)
router.get('/:_id',getOrderBySupplierID)
router.post("/approveOrder/:_id", async (req, res) => {
    const {_id} = req.params;
    try {
      // חיפוש ההזמנה לפי מזהה
      const order = await Order.findById(_id);
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      // שינוי סטטוס ההזמנה מ-"approved" ל-"in-progress"
      if (order.status === "ordered") {
        order.status = "in-progress"; // עדכון הסטטוס
        
        await order.save(); // שמירת השינוי
        return res.status(200).json({ message: "Order status updated to 'in-progress'", order });
      } 
      else if(order.status === "in-progress")
      {
        order.status = "completed";
        await order.save(); // שמירת השינוי
        return res.status(200).json({ message: "Order status updated to 'comleted'", order });
      }
      else {
        return res.status(400).json({ message: "Order is not in 'approved' status" });
      }
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error updating order status" });
    }
  });
module.exports=router