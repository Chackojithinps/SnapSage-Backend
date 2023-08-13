const express = require('express')
const multer = require('multer')

const vendorAuth = require('../Middlewares/partnerAuth')
const routes = express.Router()
const vendorController = require('../Controller/vendorController')

const path = require('path')
// const multer = require('multer')
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        console.log("multer entered")
        cb(null,path.join(__dirname,"../Public/Images"));
    },
    filename:(req,file,cb)=>{
        console.log(file)
        cb(null,Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage:storage})
routes.post('/register',vendorController.requestOTP)
routes.post('/verifyOtp',vendorController.verifyOtp)
routes.post('/login',vendorController.postLogin)
routes.get('/profile',vendorAuth.partnerAuth,vendorController.getProfile)
routes.post('/upload',vendorAuth.partnerAuth,upload.single('file'),vendorController.profileUpload)



module.exports= routes