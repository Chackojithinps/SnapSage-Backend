const mongoose = require('mongoose')

const photoSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    images:[
        {
            categoryId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Category'
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