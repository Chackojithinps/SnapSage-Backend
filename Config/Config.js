const mongoose = require('mongoose')

mongoose.connect(process.env.MONGOOSE_LINK).then(()=>{
    console.log("db connected")
}).catch((err)=>{
    console.log("mongoose :",err.message)
})
