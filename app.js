const express = require('express')
require('dotenv').config()
const mongoose = require('./Config/Config')
const userRouter = require('./Routes/user-router')
const vendorRouter = require('./Routes/vendor-router')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin:["http://localhost:3000"],
    methods:['GET','POST'],
    credentials:true
  }))
  
app.use('/',userRouter)
app.use('/vendor',vendorRouter)
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>console.log("listen to port 3000"))