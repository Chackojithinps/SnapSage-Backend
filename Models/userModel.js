const mongoose = require('mongoose')

const UserModel = new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    status:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('users',UserModel)