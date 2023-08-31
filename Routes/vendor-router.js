const express = require('express')
const multer = require('multer')

const routes = express.Router()
const vendorAuth = require('../Middlewares/partnerAuth')
const vendorController = require('../Controller/vendorController')
const studioController = require('../Controller/studioController')
const imageController = require('../Controller/imageController')
const path = require('path')

// -----------------------------------Multer---------------------------
const storage = multer.diskStorage({
    
    filename:(req,file,cb)=>{
        console.log("this is file : ",file) 
        cb(null,Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage:storage})

// -----------------------------------Vendor routes---------------------------
routes.post('/register',upload.array('image',5),vendorController.requestOTP)
routes.post('/verifyOtp',vendorController.verifyOtp)
routes.post('/login',vendorController.postLogin)

// -----------------------------------Vendor Profile---------------------------
routes.get('/profile',vendorAuth.partnerAuth,vendorController.getProfile)
routes.post('/upload',vendorAuth.partnerAuth,upload.single('file'),vendorController.profileUpload)

// ----------------------------------- Categories ---------------------------
routes.get('/getCategories',vendorAuth.partnerAuth,studioController.getCategories)
routes.post('/addStudio',vendorAuth.partnerAuth,studioController.addStudio)

// ----------------------------------- Studio ---------------------------
routes.get('/getStudios',vendorAuth.partnerAuth,imageController.getStudios)
routes.get('/getimageCategories',vendorAuth.partnerAuth,imageController.getCategories)
routes.post('/uploadStudioimg',vendorAuth.partnerAuth,upload.array('file',50), imageController.uploadImages)
routes.get('/getStudioImages',vendorAuth.partnerAuth,imageController.getStudioImages)
module.exports= routes