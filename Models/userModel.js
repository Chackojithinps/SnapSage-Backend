const mongoose = require('mongoose')

const UserModel = new mongoose.Schema({
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
    password:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('users',UserModel)


// const postRegister = async(req,res)=>{
//     try {
//         console.log(req.body)
//         const {fname,lname,phone,email,password,confirmpass} =req.body;
//         const hashPassword =await bcrypt.hash(password.toString(),10);
       
//             const userData = new User({
//                 fname,
//                 lname,
//                 phone,
//                 email,
//                 password:hashPassword
//             })
//             await userData.save()
//             res.status(200).json({message:"Successfully registered"})
//     } catch (error) {
//         console.log("postLogin",error.message(error.message))
//     }
// }