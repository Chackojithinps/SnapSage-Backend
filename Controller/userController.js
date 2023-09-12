const User = require('../Models/userModel');
const Studio = require('../Models/StudioModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../Config/Cloudinary')
const serviceSID = 'VA0b09eccc3c1bbe7188ed15edc279cf06';
const accountSID = 'AC45218f08d24b1264019eac87bdff5513';
const authToken = 'af63eb70143e97471fbf46e459f3cba8';
const client = require('twilio')(accountSID, authToken)
const nodemailer = require('nodemailer')
let userDatas = null;
let otpMap = new Map();


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
    if (userDetails.status == true) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const isPasswordMatch = await bcrypt.compare(password, userDetails.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: userDetails._id }, process.env.JWT_USER_SECRET_KEY, { expiresIn: '1d' });
    // console.log(token);

    const userDetail = {
      userName: `${userDetails.fname} ${userDetails.lname}`,
      token
    }
    res.status(200).json({ message: 'Login successful', userDetail });
  } catch (error) {
    console.log('userLogin', error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// <!--================================ Otp generate ===================================-->

const generateOTP = () => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  console.log("otp : : ", OTP)
  return OTP;
};
// <!--================================ send otp to mail ===================================-->

const sendOTP = async (email, otp) => {
  console.log("entered sendotp ")
  console.log("email , otp ", otp)
  const transporter = nodemailer.createTransport({
    host: "smpt.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    service: "Gmail",
    auth: {
      user: 'jithinchackopayyanat@gmail.com',
      pass: 'pexpekvbwxmqujlh',
    },
  });
  const mailOptions = {
    from: 'jithinchackopayyanat@gmail.com',
    to: email,
    subject: "OTP Verification",
    html: `Your OTP for email verification is <h2> ${otp}</h2>`,
  };

  try {
    // Send email with OTP
    await transporter.sendMail(mailOptions);
    // Return success response
    console.log("OTP sent successfully");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send OTP");
  }
};
// -------------------------------------------------Request Otp -------------------------------------------

const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("email", email);
    const OTP = generateOTP()
    otpMap.set(email, { OTP })
    sendOTP(email, OTP)
    res.status(200).json({ success: true })
  } catch (error) {
    console.log('requestOTP', error.message);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// ------------------------------------------------- varify otp --------------------------------------------

const verifyOtp = async (req, res) => {
  try {
    console.log("Contents of the otpMap:");
for(const [key,value] of otpMap.entries()){
  console.log(`${key}-------- ${value}`)
}
    console.log("entered verifyOtp")
    console.log("req.body.body : :", req.body)
    const { otp } = req.body
    const email = req.body.userData.email
    const password = req.body.userData.password
    const confirmpass = req.body.userData.confirmpass
    if (password == confirmpass) {
      console.log("email : ", email)
      console.log("otp : : : ", otp)
      const storedOTP = otpMap.get(email);
      console.log("storedOtp : ", storedOTP)
      if (otp == storedOTP.OTP) {
        const userDatas = req.body.userData;
        console.log("entered inside")
        const hashPassword = await bcrypt.hash(password.toString(), 10);
        const userData = new User({
          fname: userDatas.firstname,
          lname: userDatas.lastname,
          phone: userDatas.phone,
          email: userDatas.email,
          password: hashPassword
        })
        await userData.save()
        res.status(200).json({ message: "Successfully registered" })
      }
    } else {
      res.status(200).json({ message: "Password doesn't match" })
    }
  } catch (error) {
    console.log("err", error.message)
  }
}

// -------------------------------------------------Get profile -------------------------------------------

const getProfile = async (req, res) => {
  try {
    console.log("getProfile")
    console.log(req.id)
    const userDetail = await User.findOne({ _id: req.id })
    if (!userDetail) {
      return res.status(401).json({ message: "Not protected", success: false })
    }
    return res.status(200).json({ success: true, userDetail })
  } catch (error) {
    console.log("getProfile", error.message)
  }
}

// -------------------------------------------------edit user profile -------------------------------------------

const editUserProfile = async (req, res) => {
  try {
    console.log("edit profile")
    console.log(req.id)
    console.log("userEdited data ",req.body)
    const editedDetails = req.body.editedUserData
    const userDetail = await User.updateOne({ _id: req.id },{$set:{fname:editedDetails.fname,lname:editedDetails.lname,email:editedDetails.email,phone:editedDetails.phone}})
  //   if (!userDetail) {
  //     return res.status(401).json({ message: "Not protected", success: false })
  //   }
    return res.status(200).json({ success: true })
  } catch (error) {
    console.log("getProfile", error.message)
  }
}

// ------------------------------------------------- profile pic upload -------------------------------------------

const profileUpload = async (req, res) => {
  try {
    console.log("image uploaded")
    console.log(req.id)
    const result = await cloudinary.uploader.upload(req.file.path)
    const image = result.secure_url
    const data = await User.updateOne({ _id: req.id }, { $set: { image } })
    res.status(200).json({ success: true, img })
  } catch (error) {
    console.log("profilpic", error.message)
  }
}
// --------------------------------------------------- Get Studios -------------------------------------------

const getProfileData = async (req, res) => {
  try {
    console.log("getProfiledata")
    console.log(req.id)
    const userDetail = await User.findOne({ _id: req.id })
    if (!userDetail) {
      return res.status(401).json({ message: "Not protected", success: false })
    }
    return res.status(200).json({ success: true, userDetail })
  } catch (error) {
    console.log("getProfile", error.message)
  }
}
// --------------------------------------------------- Get Studios -------------------------------------------

const getStudios = async (req, res) => {
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
      }).populate('category.categories').populate('review.user')
    console.log("studioDetails : ", studioDetails)
    res.status(200).json({ success: true, studioDetails })
  } catch (error) {
    console.log("error in getStudios in userside : ", error.message)
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
  getProfileData,
  editUserProfile
};
