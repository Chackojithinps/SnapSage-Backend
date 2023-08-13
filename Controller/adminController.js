const Admin = require('../Models/adminModel')
const User = require('../Models/userModel')
const jwt = require('jsonwebtoken')
const Vendor = require('../Models/vendorModel')
const bcrypt = require('bcryptjs')

// -----------------------------------------Admin Login-------------------------------

const postLogin = async (req, res) => {
    try {
      console.log('entered admin login');
      const { email, password } = req.body;
      const adminDetails = await Admin.findOne({ email });
  
      if (!adminDetails) {
        return res.status(404).json({ message: "User doesn't exist" });
      }
  
      const isPasswordMatch = await bcrypt.compare(password, adminDetails.password);
  
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
  
      const token = jwt.sign({ id: adminDetails._id }, process.env.JWT_ADMIN_SECRET_KEY, { expiresIn: '1d' });
      console.log(token);
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.log('AdminLogin', error.message);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };


  
// const postRegister = async(req,res)=>{
//     try {
//         console.log("entered post register")
//         console.log(req.body)
//         const {email,password} =req.body;
//         const hashPassword =await bcrypt.hash(password.toString(),10);
       
//             const adminData = new Admin({
//                 email,
//                 password:hashPassword
//             })
//             await adminData.save()
//     } catch (error) {
//         console.log("postLogin",error.message)
//     }
// }


const getUserLists = async(req,res)=>{
  try {
    console.log("getting userlists")
    const UserLists = await User.find()
    // console.log("userlists : ",UserLists)
    res.status(200).json({success:true,UserLists})
  } catch (error) {
    console.log("getUserLists : ",error.message)
  }
}



const getVendorLists = async(req,res)=>{
  try {
    console.log("getting vendorlists")
    const Vendorlists = await Vendor.find()
    // console.log("vendorlists : ",Vendorlists)
    res.status(200).json({success:true,Vendorlists})
  } catch (error) {
    console.log("getvendorLists : ",error.message)
  }
}

// ----------------------------------------------Block User ----------------------------------------

const blockUser = async(req,res)=>{
  try {
    const userId = req.query.id
    const blockUser = await User.findOneAndUpdate({_id:userId},{$set:{status:true}})
    res.send({success:true})
  } catch (error) {
    console.log("block error user : ",error.message)
  }
}


const unblockUser = async(req,res)=>{
  try {
    const userId = req.query.id
    console.log("userId",userId)
    const blockUser = await User.findOneAndUpdate({_id:userId},{$set:{status:false}})
    res.send({success:true})
  } catch (error) {
    console.log("block error user : ",error.message)
  }
}

  module.exports ={postLogin,getUserLists,getVendorLists,blockUser,unblockUser}