const User = require('../Models/userModel');
const Studio = require('../Models/StudioModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../Config/Cloudinary')
const serviceSID = 'VA0b09eccc3c1bbe7188ed15edc279cf06';
const accountSID = 'AC45218f08d24b1264019eac87bdff5513';
const authToken = 'af63eb70143e97471fbf46e459f3cba8';
const client = require('twilio')(accountSID,authToken)
let userDatas = null;

// -------------------------------------------------Get Home page-------------------------------------------
const getHome = async (req, res) => {
  try {
    console.log('Homeapge');
    res.send('Home page');
  } catch (error) {
    console.log('Home', error.message);
  }
};
// -------------------------------------------------Post user Login -------------------------------------------

const postLogin = async (req, res) => {
  try {
    console.log('entered login');
    const { email, password } = req.body;
    const userDetails = await User.findOne({ email });
    console.log(userDetails)
    if (!userDetails) {
       return res.status(404).json({ message: "User doesn't exist" });
    }
    if(userDetails.status==true){
       return res.status(404).json({ message: "User doesn't exist" });
    }
    const isPasswordMatch = await bcrypt.compare(password, userDetails.password);

    if (!isPasswordMatch) {
       return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: userDetails._id }, process.env.JWT_USER_SECRET_KEY, { expiresIn: '1d' });
    // console.log(token);

    const userDetail={
      userName : `${userDetails.fname} ${userDetails.lname}`,
      token
    }
    res.status(200).json({ message: 'Login successful',userDetail});
  } catch (error) {
    console.log('userLogin', error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// -------------------------------------------------Request Otp -------------------------------------------

const requestOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    userDatas = req.body
    console.log("Phone", phone)
    await client.verify.v2.services(serviceSID)
    .verifications.create({
        to:`+91${phone}`,
        channel:"sms"
    }).then((res1)=>{
        userDatas= req.body
        console.log("res:",res1)
        return res.status(200).json({res1})
    })
  } catch (error) {
    console.log('requestOTP', error.message);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// ------------------------------------------------- varify otp -------------------------------------------

const verifyOtp = async(req,res)=>{
    try {
      const {fname,lname,phone,email,password} =userDatas;
 
        console.log("entered verifyOtp")
        console.log(req.body)
        const {otp} = req.body
        // const otp2= Number(otp)
        console.log("second : ",otp)
        const varificationResult =await client.verify.v2.services(serviceSID)
        .verificationChecks.create({
            to:`+91${phone}`,
            code:otp.toString()
        })
        console.log("varificationResult : ",varificationResult)
        if(varificationResult.status == "approved"){ 
            console.log("varification : ",userDatas)
            const hashPassword =await bcrypt.hash(password.toString(),10);
                const userData = new User({
                    fname,
                    lname,
                    phone,
                    email,
                    password:hashPassword
                })
                await userData.save()
                res.status(200).json({message:"Successfully registered"})
        }
    } catch (error) {
        console.log("err",error.message)
    }
}

// -------------------------------------------------Get profile -------------------------------------------

const getProfile = async(req,res)=>{
  try {
    console.log("getProfile")
    console.log(req.id)
    const userDetail = await User.findOne({_id:req.id})
    if(!userDetail){
      return res.status(401).json({message:"Not protected",success:false})
    }
    return res.status(200).json({success:true,userDetail})
  } catch (error) {
    console.log("getProfile",error.message)
  }
}
// ------------------------------------------------- profile pic upload -------------------------------------------

const profileUpload = async(req,res)=>{
  try {
     console.log("image uploaded")
     console.log(req.id)
     const result = await cloudinary.uploader.upload(req.file.path)
     const image=result.secure_url
     const data = await User.updateOne({_id:req.id},{$set:{image}})
     res.status(200).json({success:true,img})
  } catch (error) {
    console.log("profilpic",error.message)
  }
}
// --------------------------------------------------- Get Studios -------------------------------------------
const getProfileData = async(req,res)=>{
  try {
    console.log("getProfiledata")
    console.log(req.id)
    const userDetail = await User.findOne({_id:req.id})
    if(!userDetail){
      return res.status(401).json({message:"Not protected",success:false})
    }
    return res.status(200).json({success:true,userDetail})
  } catch (error) {
    console.log("getProfile",error.message)
  }
}
// --------------------------------------------------- Get Studios -------------------------------------------

const getStudios = async (req,res)=>{
  try {
    console.log("entered getStudio page")
    // const studioDetails = await Studio.find({varified:true}).populate('images')
    const studioDetails = await Studio.find({ varified: true })
    .populate({
      path: 'images',
      populate: {
        path: 'images.categoryId', // Populate categoryId within the images array
        model: 'category', // Replace 'category' with the correct model name
      },
    }).populate('category.categories')
    console.log("studioDetails : ",studioDetails)
    res.status(200).json({success:true,studioDetails})
  } catch (error) {
    console.log("error in getStudios in userside : ",error.message)
  }
}

module.exports = {
  getHome,
  postLogin,
  verifyOtp,
  requestOTP,
  getProfile,
  profileUpload,
  getStudios,
  getProfileData
};
