const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    studio:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'studios'
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    booking:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'booking'
    },
    rating:{
        type:Number,
        required:true
    },
    review:{
       type:String,
       required:true
    }
})

module.exports = mongoose.model("review",reviewSchema)