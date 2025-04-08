const Supplier = require("../Models/Supplier");
const jwt = require("jsonwebtoken");

const generateToken = (supplierId) => {
  return jwt.sign(
    { supplierId },
    process.env.JWT_SECRET || "secret123",
    { expiresIn: "1h" }
  );
};

const loginSupplier = async (req, res) => {
  const { phone, companyName } = req.body;

  try {
    const supplier = await Supplier.findOne({ phone, companyName });
    if (!supplier) {
      return res.status(401).json({ success: false, message: "Supplier not found" });
    }

    const token = generateToken(supplier._id);

    res.json({
      success: true,
      message: "Login successful",
      supplierId: supplier._id,
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const registerSupplier = async (req, res) => {
  const { companyName, phone, representativeName, products } = req.body;

  try {
    const existing = await Supplier.findOne({ phone, companyName });
    if (existing) {
      return res.status(400).json({ message: "Supplier already exists" });
    }

    const newSupplier = new Supplier({
      companyName,
      phone,
      representativeName,
      products
    });

    await newSupplier.save();

    res.status(201).json({ message: "Supplier registered successfully" });
  } catch (err) {
    console.error("Error registering supplier:", err);
    res.status(500).json({ message: "Failed to register supplier" });
  }
};

const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    console.error("Failed to fetch suppliers:", err);
    res.status(500).json({ message: "Error retrieving suppliers" });
  }
};

const addSupplier = async (req, res) => {
  const { companyName, phone, representativeName, products } = req.body;

  try {
    const newSupplier = new Supplier({
      companyName,
      phone,
      representativeName,
      products
    });

    await newSupplier.save();
    res.status(201).json({ message: "Supplier added successfully" });
  } catch (err) {
    console.error("Error adding supplier:", err);
    res.status(500).json({ message: "Failed to add supplier" });
  }
};

module.exports = {
  loginSupplier,
  registerSupplier,
  getAllSuppliers,
  addSupplier
};
