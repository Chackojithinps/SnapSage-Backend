const express = require('express')
const routes = express.Router()
const adminController = require('../Controller/adminController')
const categoryController = require('../Controller/categoryController')

routes.post('/login',adminController.postLogin)

routes.get('/userlists',adminController.getUserLists)
routes.patch('/blockUser',adminController.blockUser)
routes.patch('/unblockUser',adminController.unblockUser)

routes.get('/vendorlists',adminController.getVendorLists)

routes.get('/categories',categoryController.getCategories)
routes.post('/addCategory',categoryController.addCategory)
routes.patch('/editCategory',categoryController.editCategory)

module.exports= routes