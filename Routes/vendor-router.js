const express = require('express')
const routes = express.Router()
const vendorController = require('../Controller/vendorController')


routes.post('/register',vendorController.requestOTP)
routes.post('/verifyOtp',vendorController.verifyOtp)
routes.post('/login',vendorController.postLogin)

module.exports= routes