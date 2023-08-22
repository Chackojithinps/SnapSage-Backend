const mongoose = require('mongoose')

const photoSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    studioId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Studio'
    },
    images:[
        {
            categoryId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'category'
            },
            photos:{
                type:Array,
                required:true
            }
        }
    ]
},{
    timestamps:true
})

module.exports = mongoose.model("photos",photoSchema)