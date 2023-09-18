const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    sender:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    createAt:{
        type:Date,
        default:Date.now
    },
    time:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("chat",chatSchema)