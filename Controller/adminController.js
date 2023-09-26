const Admin = require('../Models/adminModel')
const User = require('../Models/userModel')
const Booking = require('../Models/bookingSchema')
const Studio = require('../Models/StudioModel')
const jwt = require('jsonwebtoken')
const Vendor = require('../Models/vendorModel')
const bcrypt = require('bcryptjs')

// ------------------------------------------------------- Admin Login -----------------------------------------------------

const postLogin = async (req, res) => {
  try {
    console.log("hello")
    const { email, password } = req.body;
    console.log("entered req.body ",req.body)
    const adminDetails = await Admin.findOne({ email });
    if (!adminDetails) {
      return res.status(401).json({ message: "User doesn't exist" });
    }
    const isPasswordMatch = await bcrypt.compare(password, adminDetails.password);
    if (!isPasswordMatch) {
      return res.status(402).json({ message: 'Incorrect password' });
    }
    const AdminToken = jwt.sign({ id: adminDetails._id ,role:"admin"}, process.env.JWT_ADMIN_SECRET_KEY, { expiresIn: '1d' });
    res.status(200).json({ message: 'Login successful', AdminToken });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
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

const getUserLists = async (req, res) => {
  try {
    const searchData = req.query.search;
    let query = {}
    if (searchData) {
      query = {
        $or: [
          { fname: { $regex: searchData, $options: "i" } },
          { lname: { $regex: searchData, $options: "i" } },
          { email: { $regex: searchData, $options: "i" } },
          { companyName: { $regex: searchData, $options: "i" } }
        ]
      }
    }
    const UserLists = await User.find(query)
    if (UserLists.length < 1) {
      console.log("no userlists")
      res.status(200).json({ success: true, message: "No datas found" })
    } else {
      console.log("eheeeee")
      res.status(200).json({ success: true, UserLists })
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ------------------------------------------------------- Get Vendor Lists -----------------------------------------------


const getVendorLists = async (req, res) => {
  try {
    console.log("getting vendorlists")
    const searchData = req.query.search
    console.log("serachdata : ", searchData)
    let query = { varified: true }
    if (searchData) {
      query = {
        varified: true,
        $or: [
          { fname: { $regex: searchData, $options: "i" } },
          { lname: { $regex: searchData, $options: "i" } },
          { email: { $regex: searchData, $options: "i" } },
          { companyName: { $regex: searchData, $options: "i" } }
        ]
      };
    }
    const Vendorlists = await Vendor.find(query)
    console.log(Vendorlists.length)
    if (Vendorlists.length < 1) {
      console.log("no vendorlists")
      res.status(200).json({ success: true, message: "No datas found" })

    } else {
      console.log("eheeeee")
      return res.status(200).json({ success: true, Vendorlists })
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// -------------------------------------------------------------Block User --------------------------------------------------

const blockUser = async (req, res) => {
  try {
    const userId = req.query.id
    const blockUser = await User.findOneAndUpdate({ _id: userId }, { $set: { status: true } })
    res.send({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// --------------------------------------------------------Unblock User -----------------------------------------------


const unblockUser = async (req, res) => {
  try {
    const userId = req.query.id
    console.log("userId", userId)
    const blockUser = await User.findOneAndUpdate({ _id: userId }, { $set: { status: false } })
    res.send({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// --------------------------------------------- Get Unvarified vendor req -----------------------------------------------

const getUnvarified = async (req, res) => {
  try {
    const searchData = req.query.search
    let query = { varified: false }
    if (searchData) {
      query = {
        varified: false,
        $or: [
          { fname: { $regex: searchData, $options: "i" } },
          { lname: { $regex: searchData, $options: "i" } },
          { email: { $regex: searchData, $options: "i" } },
          { companyName: { $regex: searchData, $options: "i" } }
        ]
      };
    }
    const Vendorlists = await Vendor.find(query)
    console.log(Vendorlists.length)
    if (Vendorlists.length < 1) {
      console.log("no vendorlists")
      res.status(200).json({ success: true, message: "No datas found" })
    } else {
      console.log("eheeeee")
      return res.status(200).json({ success: true, Vendorlists })
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ---------------------------------------------------- Varify Vendor requests --------------------------------------------

const verifyVendor = async (req, res) => {
  try {
    const unVarifiedUser = await Vendor.updateOne({ _id: req.query.id }, { $set: { varified: true } })
    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ----------------------------------------------------- Reject Vendor requests ---------------------------------------------

const rejectVendor = async (req, res) => {
  try {
    const deleteVendor = await Vendor.deleteOne({ _id: req.query.id })
    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ----------------------------------------------------- get Unvarified Studios ---------------------------------------------

const getUnvarifiedStudios = async (req, res) => {
  try {
    const searchData = req.query.search
    let query = { varified: false }
    if (searchData) {
      query = {
        varified: false,
        $or: [
          { companyName: { $regex: searchData, $options: "i" } },
          { place: { $regex: searchData, $options: "i" } },
          { city: { $regex: searchData, $options: "i" } },
          { email: { $regex: searchData, $options: "i" } }
        ]
      };
    }
    const studioDatas = await Studio.find(query)
    console.log(studioDatas.length)
    if (studioDatas.length < 1) {
      console.log("no vendorlists")
      res.status(200).json({ success: true, message: "No datas found" })
    } else {
      return res.status(200).json({ success: true, studioDatas })
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ----------------------------------------------------- Varify Studio ---------------------------------------------
const varifyStudio = async (req, res) => {
  try {
    console.log("entered varify Studio ")
    console.log(req.query.id)
    const unVarifiedUser = await Studio.updateOne({ _id: req.query.id }, { $set: { varified: true } })
    console.log("unVarifiedUser : ", unVarifiedUser)
    res.status(200).json({ success: true })


  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ----------------------------------------------------- get datas for admin dash ---------------------------------------------
const getDatas = async (req, res) => {
  try {
    console.log("entered get Datas page")
    let VarifiedPartner= 0;
    let PartnerRequests = 0;
    let VarifiedStudios = 0;
    let studioRequests =0;
    const PartnerDatas = await Vendor.find()
    PartnerDatas.forEach((data)=>{
      if(data.varified){
           VarifiedPartner++;
      }else{
           PartnerRequests++;
      }
    })
    const studioDatas = await Studio.find()
    studioDatas.forEach((data)=>{
         if(data.varified){
            VarifiedStudios++;
         }else{
           studioRequests++;
         }
    })

    const Datas = {VarifiedPartner,PartnerRequests,VarifiedStudios,studioRequests}
    console.log("Datas : ",Datas)

    // const BookingData = await Booking.find().populate('studio')
    const BookingData = await Booking.find().populate('studio').populate('user').populate('categories.categoryId').sort({createdAt:-1})

    let Sunday = 0;
    let Monday = 0;
    let Tuesday = 0;
    let Wednesday = 0;
    let Thursday = 0;
    let Friday = 0;
    let Saturday = 0;
    let BookingCount = BookingData.length;
    BookingData.forEach((bookings) => {
        const dayOfWeekIndex = bookings.createdAt.getDay();
        if (dayOfWeekIndex == 0) {
          Sunday++;
        } else if (dayOfWeekIndex == 1){
          Monday++
        } else if (dayOfWeekIndex == 2){
          Tuesday++
        }else if (dayOfWeekIndex == 3) {
           Wednesday++
        }else if(dayOfWeekIndex==4){
          Thursday++
        }else if(dayOfWeekIndex==5){
          Friday++
        }else{
          Saturday++;
        }
        console.log(dayOfWeekIndex,"----")
    })
    const user= await User.find()
    let userCount = user.length;
    const Days = {Sunday,Monday,Tuesday,Wednesday,Thursday,BookingCount,Friday,Saturday,userCount}
    res.status(200).json({ success: true ,Datas,Days,BookingData })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', });
  }
}


module.exports = {
  postLogin,
  getUserLists,
  getVendorLists,
  blockUser,
  unblockUser,
  getUnvarified,
  verifyVendor,
  rejectVendor,
  getUnvarifiedStudios,
  varifyStudio,
  getDatas
}