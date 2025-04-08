require("dotenv").config()
const connectDB = require("./config/dbConnect")
const cors=require("cors")
const express=require("express")
const app=express()
const mongoose=require("mongoose")
const corsOptions = require("./config/corsOptions")
const PORT=process.env.PORT||6000
connectDB()
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port
    ${PORT}`))
    })
    mongoose.connection.on('error', err => {
    console.log(err)
    })

app.use(express.json())
app.use(cors(corsOptions))
app.use("/api/SupplierModel",require("./Routers/SupllierRouter"))
app.use("/api/OrderModel",require("./Routers/OrderRouter"))

app.get('/',(req,res)=>{
    res.send("homepage")
})


