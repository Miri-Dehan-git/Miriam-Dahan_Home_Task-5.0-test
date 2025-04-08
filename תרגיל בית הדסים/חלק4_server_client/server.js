require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const connectDB = require("./config/dbConnect");
const corsOptions = require("./config/corsOptions");

const PORT = process.env.PORT || 6000;

const app = express();

connectDB();

mongoose.connection.once("open", () => {
  console.log(" Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.error(" MongoDB connection error:", err);
});

app.use(express.json());             
app.use(cors(corsOptions));         

app.use("/api/owner", require("./Routers/OwnerRoutes"));
console.log(" SupllierRouter:", require("./Routers/SupllierRouter"));

app.use("/api/SupplierModel", require("./Routers/SupllierRouter"));
app.use("/api/OrderModel", require("./Routers/OrderRouter"));

app.get("/", (req, res) => {
  res.send(" ברוך הבא לשרת ניהול ההזמנות!");
});
