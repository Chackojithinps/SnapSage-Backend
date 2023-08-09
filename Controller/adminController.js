const Admin = require('../Models/adminModel')
const jwt = require('jsonwebtoken')
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
  
      const token = jwt.sign({ id: adminDetails._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
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

  module.exports ={postLogin}