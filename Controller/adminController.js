const Admin = require('../Models/adminModel')
const User = require('../Models/userModel')
const jwt = require('jsonwebtoken')
const Vendor = require('../Models/vendorModel')
const bcrypt = require('bcryptjs')

// ------------------------------------------------------- Admin Login -----------------------------------------------------

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
  
      const AdminToken = jwt.sign({ id: adminDetails._id }, process.env.JWT_ADMIN_SECRET_KEY, { expiresIn: '1d' });
      // console.log(token);
      res.status(200).json({ message: 'Login successful', AdminToken });
    } catch (error) {
      console.log('AdminLogin', error.message);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };

// --------------------------------------------------------Admin register -----------------------------------------------

  
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

// --------------------------------------------------------Get User lists -----------------------------------------------

const getUserLists = async(req,res)=>{
  try {
    console.log("getting userlists")
    const searchData = req.query.search;
    let query={}
    if(searchData){
      query={
        $or: [
          { fname: { $regex: searchData, $options: "i" } }, 
          { lname: { $regex: searchData, $options: "i" } }, 
          { email: { $regex: searchData, $options: "i" } }, 
          { companyName: { $regex: searchData, $options: "i" }}
        ]
      }
    }
    const UserLists = await User.find(query)
    if(UserLists.length<1){
      console.log("no userlists")
       res.status(200).json({success:true,message:"No datas found"})

    }else{

      console.log("eheeeee")
     res.status(200).json({success:true,UserLists})

    }
  } catch (error) {
    console.log("getUserLists : ",error.message)
  }
}

// ------------------------------------------------------- Get Vendor Lists -----------------------------------------------


const getVendorLists = async(req,res)=>{
  try {
    console.log("getting vendorlists")
    
    const searchData = req.query.search
    console.log("serachdata : ",searchData)
    
    let query={varified:true}
    if(searchData){
       query = {
        varified: true,
        $or: [
          { fname: { $regex: searchData, $options: "i" } }, 
          { lname: { $regex: searchData, $options: "i" } }, 
          { email: { $regex: searchData, $options: "i" } }, 
          { companyName: { $regex: searchData, $options: "i" }}
        ]
      };
    }
    const Vendorlists = await Vendor.find(query)
    // console.log("vendorlists : ",Vendorlists)
    console.log(Vendorlists.length)
    if(Vendorlists.length<1){
      console.log("no vendorlists")
       res.status(200).json({success:true,message:"No datas found"})

    }else{

      console.log("eheeeee")
      return res.status(200).json({success:true,Vendorlists})
    }
  } catch (error) {
    console.log("getvendorLists : ",error.message)
  }
}

// -------------------------------------------------------------Block User --------------------------------------------------

const blockUser = async(req,res)=>{
  try {
    const userId = req.query.id
    const blockUser = await User.findOneAndUpdate({_id:userId},{$set:{status:true}})
    res.send({success:true})
  } catch (error) {
    console.log("block error user : ",error.message)
  }
}

// --------------------------------------------------------Unblock User -----------------------------------------------


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

// --------------------------------------------- Get Unvarified vendor req -----------------------------------------------

const getUnvarified = async(req,res)=>{
  try {
    console.log("getting unverified vendorlists")
    
    const searchData = req.query.search
    console.log("serachdata : ",searchData)
    
    let query={varified:false}
    if(searchData){
       query = {
        varified: false,
        $or: [
          { fname: { $regex: searchData, $options: "i" }}, 
          { lname: { $regex: searchData, $options: "i" }}, 
          { email: { $regex: searchData, $options: "i" }}, 
          { companyName: { $regex: searchData, $options: "i" }}
        ]
      };
    }
    const Vendorlists = await Vendor.find(query)
    // console.log("vendorlists : ",Vendorlists)
    console.log(Vendorlists.length)
    if(Vendorlists.length<1){
      console.log("no vendorlists")
       res.status(200).json({success:true,message:"No datas found"})

    }else{

      console.log("eheeeee")
      return res.status(200).json({success:true,Vendorlists})
    }
  } catch (error) {
    console.log("getvendorLists : ",error.message)
  }
}

// ---------------------------------------------------- Varify Vendor requests --------------------------------------------

const verifyVendor = async (req,res) =>{
   try {
      console.log("entered varify user ")
      console.log(req.query.id)
      const unVarifiedUser = await Vendor.updateOne({_id:req.query.id},{$set:{varified:true}})
      console.log("unVarifiedUser : ",unVarifiedUser)
      res.status(200).json({success: true})


   } catch (error) {
      console.log("varify vendor : ",error.message)
   }
}

// ----------------------------------------------------- Reject Vendor requests ---------------------------------------------

const rejectVendor = async (req,res) =>{
  try {
     console.log("entered reject user ")
     console.log(req.query.id)
     const deleteVendor = await Vendor.deleteOne({_id:req.query.id})
     console.log("unVarifiedUser : ",deleteVendor)
     res.status(200).json({success: true})


  } catch (error) {
     console.log("varify vendor : ",error.message)
  }
}

  module.exports ={postLogin,
    getUserLists,
    getVendorLists,
    blockUser,
    unblockUser,
    getUnvarified,
    verifyVendor,
    rejectVendor,
  }