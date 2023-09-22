const express = require('express')
const multer = require('multer')

const routes = express.Router()
const vendorAuth = require('../Middlewares/partnerAuth')
const vendorController = require('../Controller/vendorController')
const studioController = require('../Controller/studioController')
const imageController = require('../Controller/imageController')
const bookingController = require('../Controller/bookingController')
const offerController = require('../Controller/offerController')

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
routes.post('/register',upload.array('image',5),vendorController.vendorSignup)
// routes.post('/verifyOtp',vendorController.verifyOtp)
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

// ----------------------------------- bookings ---------------------------
routes.get('/bookings',vendorAuth.partnerAuth,bookingController.Bookings)
routes.patch('/acceptBooking',vendorAuth.partnerAuth,bookingController.acceptBooking)
routes.get('/upcomingEvents',vendorAuth.partnerAuth,bookingController.upcomingEvents)
routes.get('/unpaidBookings',vendorAuth.partnerAuth,bookingController.unpaidBookings)
routes.patch('/finishWork',vendorAuth.partnerAuth,bookingController.finishWork)
routes.get('/workHistory',vendorAuth.partnerAuth,bookingController.workHistory)
routes.post('/rejectUnpaiduser',vendorAuth.partnerAuth,bookingController.rejectUnpaiduser)
routes.get('/allBookings',vendorAuth.partnerAuth,bookingController.allBookings)

// ----------------------------------- Offers ---------------------------
routes.post('/addOffer',vendorAuth.partnerAuth,offerController.addOffer)
routes.get('/getOffers',vendorAuth.partnerAuth,offerController.getOfferstoVendor)
routes.patch('/listOffer',vendorAuth.partnerAuth,offerController.listOffer)
routes.patch('/unlistOffer',vendorAuth.partnerAuth,offerController.unlistOffer)

module.exports= routes