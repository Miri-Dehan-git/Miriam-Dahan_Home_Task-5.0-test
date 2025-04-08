const Supplier=require("../Models/Supplier")
const mongoose=require("mongoose")
const getAllSuppliers=async(req,res)=>{
    const suppliers=await Supplier.find().lean()
    if(!suppliers)
    {
        res.status(400).json({message:'there are no suppliers'})
 
    }
    else{
        res.json(suppliers)
    }
}

const addSupplier=async(req,res)=>{
const {companyName,phone,representativeName,products}=req.body
console.log()
    const supplier=await Supplier.create({companyName,phone,representativeName,products})
    if (supplier) { // Created
        return res.status(201).json({ message: 'New supplier created' })
        } else {
        return res.status(400).json({ message: 'Invalid supplier ' })}
    }
module.exports={getAllSuppliers,addSupplier}
