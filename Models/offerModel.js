const mongoose = require('mongoose')

const offerSchmea = new mongoose.Schema({
    vendor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    user:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }],
    offerName:{
        type:String,
        required:true
    },
    percentage:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    isListed:{
        type:Boolean,
        default:true
    },
    oneTime:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model("offer",offerSchmea)