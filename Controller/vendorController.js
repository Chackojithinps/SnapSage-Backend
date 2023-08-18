const Vendor = require('../Models/vendorModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const serviceSID = 'VA0b09eccc3c1bbe7188ed15edc279cf06';
const accountSID = 'AC45218f08d24b1264019eac87bdff5513';
const authToken = 'af63eb70143e97471fbf46e459f3cba8';
const client = require('twilio')(accountSID, authToken)
const cloudinary = require('../Config/Cloudinary')

let vendorDatas = null;

//-------------------------------Send Otp Vendor side------------------------------->

const requestOTP = async (req, res) => {
  try {
    console.log("vendor side")
    console.log("req.body : ", req.body)
    const { phone } = req.body;
    vendorDatas = req.body
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
      const { fname, lname, phone, email, companyName, district, password } = vendorDatas;
      console.log("varification : ", vendorDatas)
      const hashPassword = await bcrypt.hash(password.toString(), 10);
      const vendorData = new Vendor({
        fname,
        lname,
        phone,
        email,
        companyName,
        district,
        password: hashPassword
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