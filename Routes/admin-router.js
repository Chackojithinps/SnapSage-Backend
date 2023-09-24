const express = require('express')
const routes = express.Router()
const adminController = require('../Controller/adminController')
const categoryController = require('../Controller/categoryController')
const chatController = require('../Controller/chatController')
const adminAuth = require('../Middlewares/adminAuth')

// -----------------------------Admin Login-------------------------
routes.post('/login',adminController.postLogin)

// -----------------------------User Management---------------------
routes.get('/userlists',adminAuth.adminAuth,adminController.getUserLists)
routes.patch('/blockUser',adminAuth.adminAuth,adminController.blockUser)
routes.patch('/unblockUser',adminAuth.adminAuth,adminController.unblockUser)

// ---------------------------Vendor Management---------------------
routes.get('/vendorlists',adminAuth.adminAuth,adminController.getVendorLists)
routes.get('/getUnverified',adminAuth.adminAuth,adminController.getUnvarified)
routes.patch('/verifyVendor',adminAuth.adminAuth,adminController.verifyVendor)
routes.post('/rejectVendor',adminAuth.adminAuth,adminController.rejectVendor)

// -------------------------Category Management-------------------------
routes.get('/categories',adminAuth.adminAuth,categoryController.getCategories)
routes.post('/addCategory',adminAuth.adminAuth,categoryController.addCategory)
routes.patch('/editCategory',adminAuth.adminAuth,categoryController.editCategory)

// -------------------------Studio Management---------------------
routes.get('/getUnvarifiedStudios',adminAuth.adminAuth,adminController.getUnvarifiedStudios)
routes.patch('/verifyStudio',adminAuth.adminAuth,adminController.varifyStudio)

// -------------------------Chat Management---------------------
routes.get('/chatLists',adminAuth.adminAuth,chatController.chatLists)
routes.get('/userChats',adminAuth.adminAuth,chatController.userChats)
routes.post('/addChat',adminAuth.adminAuth,chatController.addChatAdmin)
routes.get('/getDatas',adminAuth.adminAuth,adminController.getDatas)

module.exports= routes