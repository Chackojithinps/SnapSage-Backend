const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    studio:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'studios'
    },
    message:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    eventDate:{
        type:Date,
        required:true
    },
    categories:[{
        categoryId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'category'
        }
    }],
    bookingStatus:{
        type:Boolean,
        default:false
    },
    advanceAmount:{
        type:Number,
    },
    totalAmount:{
        type:Number
    },
    workStatus:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

module.exports = mongoose.model("booking",bookingSchema)