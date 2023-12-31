const mongoose = require('mongoose')

const vendorSchema = new mongoose.Schema({
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
    companyName:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
       type:Array,
       required:true
    },
    unionCode:{
        type:String,
        require:true
    },
    varified:{
        type:Boolean,
        default:false
    },
    profile:{
        type:String
    }
   
})
module.exports = mongoose.model('vendors',vendorSchema)
