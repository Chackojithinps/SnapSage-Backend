const Vendor = require('../Models/vendorModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const serviceSID = 'VA53cf11013caab9faf4fa4200849c6dfe';
const accountSID = 'AC45218f08d24b1264019eac87bdff5513';
const authToken = 'ef312426ae5c88c37480af563156bede';
const client = require('twilio')(accountSID, authToken)
const cloudinary = require('../Config/Cloudinary')

let vendorDatas = null;
let vendorImages =null;
//-------------------------------Send Otp Vendor side------------------------------->

const requestOTP = async (req, res) => {
  try {
    console.log("vendor side")
    console.log("req.body : ", req.body)
    console.log("req.files : ",req.files)
    const { phone } = req.body;
    vendorDatas = req.body
    vendorImages = req.files
    console.log("Phone", phone)
    client.verify.v2.services(serviceSID)
      .verifications.create({
        to: `+91${phone}`,
        channel: "sms"
      }).then((res1) => {
        vendorDatas = req.body
        console.log("res:", res1)
        return res.status(200).json({ res1 })
      })
  } catch (error) {
    console.log('requestOTP', error.message);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// -------------------------------------Verify Otp Vendor Side ----------------->

const verifyOtp = async (req, res) => {
  try {
    console.log("entered verifyOtp")
    console.log(req.body)
    const { otp } = req.body
    console.log("second : ", otp)
    const varificationResult = await client.verify.v2.services(serviceSID)
      .verificationChecks.create({
        to: "+918156909537",
        code: otp.toString()
      })
    console.log("varificationResult : ", varificationResult)
    if (varificationResult.status == "approved") {
      const { fname, lname, phone, email, companyName, district, password,unionCode } = vendorDatas;
      console.log("varification : ", vendorDatas)

      const img=[];
      const vendorImg = vendorImages
      console.log("vendorImg : ",vendorImg)
      for(const file of vendorImg){
        const result = await cloudinary.uploader.upload(file.path,{folder:'SnapSage-Varification'});
        img.push(result.secure_url)
        console.log("result : ",result)
      }
   
      
     
      // fileData.forEach( async element => {
      //   const result = await cloudinary.uploader.upload(element.path,{folder:'SnapSage-Varification'});
      //   img.push(result.secure_url)
      // });
      console.log("img : ",img)
      const hashPassword = await bcrypt.hash(password.toString(), 10);
      const vendorData = new Vendor({
        fname,
        lname,
        phone,
        email,
        companyName,
        district,
        password: hashPassword,
        image:img,
        unionCode
      })
      await vendorData.save()
      res.status(200).json({ message: "Successfully registered" })
    }
  } catch (error) {
    console.log("err", error.message)
  }
}

// ----------------------------------Vendor Login --------------------------------

const postLogin = async (req, res) => {
  try {
    console.log('entered vendor login');
    const { email, password } = req.body;
    console.log("req.body : ", req.body)
    const VendorDetails = await Vendor.findOne({ email });

    if (!VendorDetails){
        return res.status(404).json({ message: "User doesn't exist" });
    }

    const isPasswordMatch = await bcrypt.compare(password, VendorDetails.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: VendorDetails._id }, process.env.JWT_VENDOR_SECRET_KEY, { expiresIn: '1d' });
    const vendorDetail = {
      userName: `${VendorDetails.fname} ${VendorDetails.lname}`,
      token
    }
    console.log(token);
    res.status(200).json({ message: 'Login successful', vendorDetail });

  } catch (error) {
    console.log('userLogin', error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


// ---------------------------------------Get Vender Profile------------------------------------

const getProfile = async(req,res)=>{
  try {
    console.log("getProfile")
    console.log(req.id)
    const vendorDetail = await Vendor.findOne({_id:req.id})
    console.log("vendorDetail : ",vendorDetail)
    if(!vendorDetail){
      return res.status(401).json({message:"Not protected",success:false})
    }
    return res.status(200).json({success:true,vendorDetail})
  } catch (error) {
    console.log("getVendorProfile eroor : ", error.message)
  }
}

// --------------------------------------------Profile image upload---------------------------------
const profileUpload = async(req,res)=>{
  try {
     console.log("image uploaded")
     console.log("req.body ,",req.body)
     console.log("req.file : ",req.file)
     const result = await cloudinary.uploader.upload(req.file.path)
     console.log(result)
     const image=result.secure_url
    //  const img= req.file.filename
     console.log("image",image)
     const data = await Vendor.updateOne({_id:req.id},{$set:{image:image}})
    //  const vendorDetails =  await Vendor.findOne({_id:req.id})
     res.status(200).json({success:true,image})
  } catch (error) {
    console.log("profilpic",error.message)
  }
}
module.exports = { requestOTP, verifyOtp, postLogin , getProfile,profileUpload }