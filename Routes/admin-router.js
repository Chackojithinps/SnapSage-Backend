const express = require('express')
const routes = express.Router()
const adminController = require('../Controller/adminController')
const categoryController = require('../Controller/categoryController')

// -----------------------------Admin Login-------------------------
routes.post('/login',adminController.postLogin)

// -----------------------------User Management---------------------
routes.get('/userlists',adminController.getUserLists)
routes.patch('/blockUser',adminController.blockUser)
routes.patch('/unblockUser',adminController.unblockUser)

// ---------------------------Vendor Management---------------------
routes.get('/vendorlists',adminController.getVendorLists)
routes.get('/getUnverified',adminController.getUnvarified)
routes.patch('/verifyVendor',adminController.verifyVendor)
routes.post('/rejectVendor',adminController.rejectVendor)

// -------------------------Category Management---------------------
routes.get('/categories',categoryController.getCategories)
routes.post('/addCategory',categoryController.addCategory)
routes.patch('/editCategory',categoryController.editCategory)

// -------------------------Studio Management---------------------
routes.get('/getUnvarifiedStudios',adminController.getUnvarifiedStudios)
routes.patch('/verifyStudio',adminController.varifyStudio)



module.exports= routes