const express = require('express')
const routes = express.Router()
const adminController = require('../Controller/adminController')

routes.post('/login',adminController.postLogin)

module.exports= routes