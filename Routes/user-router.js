const express = require('express')
const multer = require('multer')
const routes = express.Router()
const userController = require('../Controller/userController')
const userAuth = require('../Middlewares/userAuth')
// const storage = require('../Middlewares/multer')

const path = require('path')
// const multer = require('multer')
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


routes.get('/',userController.getHome)
routes.post('/register',userController.requestOTP)
routes.post('/login',userController.postLogin)
routes.post('/verifyOtp',userController.verifyOtp)
routes.get('/profile',userAuth.userAuth,userController.getProfile)
routes.post('/upload',userAuth.userAuth,upload.single('file'),userController.profileUpload)

routes.get('/getStudios',userController.getStudios)
module.exports = routes