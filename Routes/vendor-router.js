const express = require('express')
const multer = require('multer')

const routes = express.Router()
const vendorAuth = require('../Middlewares/partnerAuth')
const vendorController = require('../Controller/vendorController')
const studioController = require('../Controller/studioController')
const imageController = require('../Controller/imageController')

const path = require('path')
// const multer = require('multer')
const storage = multer.diskStorage({
    // destination:(req,file,cb)=>{
    //     console.log("multer entered")
    //     cb(null,path.join(__dirname,"../Public/Images"));
    // },
    filename:(req,file,cb)=>{
        console.log("this is file : ",file) 
        cb(null,Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage:storage})

routes.post('/register',vendorController.requestOTP)
routes.post('/verifyOtp',vendorController.verifyOtp)
routes.post('/login',vendorController.postLogin)


routes.get('/profile',vendorAuth.partnerAuth,vendorController.getProfile)
routes.post('/upload',vendorAuth.partnerAuth,upload.single('file'),vendorController.profileUpload)

routes.get('/getCategories',vendorAuth.partnerAuth,studioController.getCategories)
routes.post('/addStudio',vendorAuth.partnerAuth,studioController.addStudio)

routes.get('/getStudios',vendorAuth.partnerAuth,imageController.getStudios)
routes.get('/getimageCategories',vendorAuth.partnerAuth,imageController.getCategories)
routes.post('/uploadStudioimg',vendorAuth.partnerAuth,upload.array('file',30), imageController.uploadImages)
module.exports= routes