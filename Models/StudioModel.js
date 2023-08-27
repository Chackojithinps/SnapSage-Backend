const mongoose = require('mongoose')

const studioSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    email:{
        type:String,
        required:true
    },
    category: [
        {
            categories: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category',
                required:true
            },
            price: {
                type: Number,
                required: true
            },
           
        }
    ],
    images:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'photos'
    },
    description:{
        type:String,
        require:true
    },
    district: {
        type: String,
        required: true
    },
    city:{
        type:String,
        required:true
    },
    pin:{
        type:String,
        required:true
    },
    isBlocked:{
        type:Boolean,
    }
},{
    timestamps:true
})

module.exports = mongoose.model("studios", studioSchema)


