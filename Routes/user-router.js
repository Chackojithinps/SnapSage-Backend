const express = require('express')
const routes = express.Router()
const userController = require('../Controller/userController')


routes.get('/',userController.getHome)
routes.post('/register',userController.requestOTP)
routes.post('/login',userController.postLogin)
routes.post('/verifyOtp',userController.verifyOtp)

module.exports = routes