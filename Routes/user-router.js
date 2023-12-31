const express = require('express')
const multer = require('multer')
const routes = express.Router()
const userController = require('../Controller/userController')
const bookingController = require('../Controller/bookingController')
const offerController= require('../Controller/offerController')
const chatController = require('../Controller/chatController')
const categoryController = require('../Controller/categoryController')
const userAuth = require('../Middlewares/userAuth')
const path = require('path')

// ------------------------------Multer part------------------------------
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        console.log("multer enteed")
        cb(null,path.join(__dirname,"../Public/Images"));
    },
    filename:(req,file,cb)=>{
        console.log(file)
        cb(null,Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage:storage})


// --------------------------------User Routes-------------------------------
routes.get('/',userController.getHome)
routes.post('/register',userController.requestOTP)
routes.post('/login',userController.postLogin)
routes.post('/verifyOtp',userController.verifyOtp)

// -----------------------------------User Profile---------------------------

routes.get('/profile',userAuth.userAuth,userController.getProfile)
routes.post('/upload',userAuth.userAuth,upload.single('file'),userController.profileUpload)
routes.get('/getProfileData',userAuth.userAuth,userController.getProfileData)
routes.patch('/editUserProfile',userAuth.userAuth,userController.editUserProfile)

// -----------------------------------Studios---------------------------

routes.get('/getStudios',userController.getStudios)

//------------------------------------Bookings---------------------------

routes.post('/bookStudio',userAuth.userAuth,bookingController.bookingRequest)
routes.get('/bookings',userAuth.userAuth,bookingController.bookingList)
routes.post('/payment',userAuth.userAuth,bookingController.payment)
routes.post('/verifyPayment',userAuth.userAuth,bookingController.VarifyPayment)
routes.get('/bookingHistory',userAuth.userAuth,bookingController.bookingHistory)

//------------------------------------ Offers ------------------------------
routes.get('/getOffers',offerController.getOffers)

//------------------------------------ reviews ------------------------------
routes.get('/isUserBooked',userAuth.userAuth,bookingController.isUserBooked)
routes.post('/addReview',userAuth.userAuth,bookingController.addReview)

//------------------------------------ chat ------------------------------

routes.post('/addChat',userAuth.userAuth,chatController.addChat)
routes.get('/getChats',userAuth.userAuth,chatController.getChats)

//------------------------------------ categories ------------------------------

routes.get('/getCategories',categoryController.getCategories)

module.exports = routes