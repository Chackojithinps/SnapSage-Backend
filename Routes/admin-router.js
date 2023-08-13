const express = require('express')
const routes = express.Router()
const adminController = require('../Controller/adminController')

routes.post('/login',adminController.postLogin)
routes.get('/userlists',adminController.getUserLists)
routes.get('/vendorlists',adminController.getVendorLists)
routes.patch('/blockUser',adminController.blockUser)
routes.patch('/unblockUser',adminController.unblockUser)
module.exports= routes