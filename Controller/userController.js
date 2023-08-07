const User = require('../Models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const serviceSID = 'VA0b09eccc3c1bbe7188ed15edc279cf06';
const accountSID = 'AC45218f08d24b1264019eac87bdff5513';
const authToken = '51a861dba29dda2ef879106870ec876e';
const client = require('twilio')(accountSID,authToken)

const getHome = async (req, res) => {
  try {
    console.log('Homeapge');
    res.send('Home page');
  } catch (error) {
    console.log('Home', error.message);
  }
};

const postLogin = async (req, res) => {
  try {
    console.log('entered login');
    const { email, password } = req.body;
    const userDetails = await User.findOne({ email });

    if (!userDetails) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const isPasswordMatch = await bcrypt.compare(password, userDetails.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: userDetails._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
    console.log(token);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.log('userLogin', error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const requestOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    // console.log("Phone", phone)
    client.verify.services(serviceSID)
    .verifications.create({
        to:`+91${phone}`,
        channel:"sms"
    }).then((res1)=>{
        console.log("res:",res1)
        return res.status(200).json({res1})
    })
  } catch (error) {
    console.log('requestOTP', error.message);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

const verifyOtp = async(req,res)=>{
    try {
        console.log("entered verifyOtp")
        console.log(req.body)
        const {otp} = req.body
        // const otp2= Number(otp)
        console.log("second : ",otp)
        const varificationResult = client.verify.services(serviceSID)
        .verificationChecks.create({
            to:"+918156909537",
            code:otp.toString()
        })
        if(varificationResult.status == "approved"){ 
            const {fname,lname,phone,email,password} =req.body;
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




module.exports = {
  getHome,
  postLogin,
  verifyOtp,
  requestOTP,
};
