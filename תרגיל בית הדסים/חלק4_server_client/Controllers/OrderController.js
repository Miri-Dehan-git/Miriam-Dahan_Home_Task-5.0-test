const Order=require("../Models/Orders")
const mongoose=require("mongoose")
const addOrder = async (req, res) => {
  console.log("in addOrder")
  try {
      const { supplierId, productName, quantity ,price} = req.body;
      const order = await Order.create({ supplierId, productName, quantity ,price});
      return res.status(201).json({ message: "Order added!", order });
  } catch (error) {
      console.error("Error adding order:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
  }
};



const getAllOrders=async(req,res)=>{
    const orders=await Order.find().lean()
    if(!orders)
    {
        res.json({message:"there are no orders!"})
 
    }
    else{
        res.json(orders)
    }
}
const getOrderBySupplierID = async (req, res) => {
    const { _id } = req.params; // ספק ה-ID
    try {
      // חיפוש הזמנות לפי ה-supplierID
      const orders = await Order.find({ supplierId: _id }).lean();
  
      if (orders.length === 0) {
        return res.status(400).json({ message: "There are no orders for this supplier" });
      }
  
      // החזרת ההזמנות
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching orders" });
    }
  };
  
module.exports={addOrder,getAllOrders,getOrderBySupplierID}
