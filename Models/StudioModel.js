const mongoose = require('mongoose')

const studioSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    category: [
        {
            categories: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category'
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    description:{
        type:String,
        require:true
    },
    isBlocked:{
        type:Boolean,
    }
},{
    timestamps:true
})

module.exports = mongoose.model("studios", studioSchema)


