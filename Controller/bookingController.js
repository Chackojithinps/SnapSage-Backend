const Booking = require('../Models/bookingSchema');
const Photos = require('../Models/photoSchema')
const Studio = require('../Models/StudioModel')
const Razorpay = require('razorpay');
const mongoose = require('mongoose')
const crypto = require('crypto')
const nodemailer = require("nodemailer");


// ------------------------------------------booking History ---------------------------------------------

const bookingHistory = async (req, res) => {
  try {
    console.log(" bookings History")
    console.log("req.id ", req.id)

    const BookingList = await Booking.find({user:req.id,workStatus:true}).populate('studio').populate('categories.categoryId').exec();
    await Studio.populate(BookingList, {
      path: 'studio.images',
      model: 'photos'
    });
    console.log("BookingList : ", BookingList)
    res.status(200).json({ success: true, BookingList })
  } catch (error) {
    console.log("bookingList : ", error.message)
  }
}

// ------------------------------------------booking req by user ---------------------------------------------

const bookingRequest = async (req, res) => {
  try {
    console.log("entered booking");
    console.log(req.id)
    const { message, email, phone, district, city, eventDate, totalAmount, categories, studioId } = req.body;
    console.log("message : ",message)
    console.log("req.body : ", req.body)
    const bookingData = new Booking({
      user: req.id,
      studio: studioId,
      district,
      city,
      message,
      email,
      phone,
      eventDate,
      totalAmount,
      categories: categories.map((categoryId) => ({
        categoryId, // Store each category ID in the categories array
      })),
    });

    await bookingData.save();
    res.status(201).json({ success: true, bookingData });
  } catch (error) {
    console.log("booking request: ", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

// ------------------------------------------ Get booked list in user Side ---------------------------------------------

const bookingList = async (req, res) => {
  try {
    console.log(" bookings List")
    console.log("req.id ", req.id)

    const BookingList = await Booking.find({ user: req.id ,workStatus:false}).populate('studio').populate('categories.categoryId').exec();
    await Studio.populate(BookingList, {
      path: 'studio.images',
      model: 'photos'
    });
    console.log("BookingList : ", BookingList)
    res.status(200).json({ success: true, BookingList })
  } catch (error) {
    console.log("bookingList : ", error.message)
  }
}


// ------------------------------------------------------------Payment integration---------------------------------------------

const payment = async (req, res) => {
  try {
    console.log("entetered payment")
    var instance = new Razorpay({
      key_id: 'rzp_test_Qt18oumm8k0BKa',
      key_secret: 'vZ035cWAKANlYeO7bZxShcNT'
    });
    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
    }
    instance.orders.create(options, function (err, order) {
      if (err) {
        return res.send({ code: 500, message: "Server Err." })
      }
      return res.send({ code: 200, success: true, message: 'order created', data: order })
    })

  } catch (error) {
    console.log("payment", error.message)
  }
}

// ------------------------------------------------------------Payment varify---------------------------------------------

const VarifyPayment = async (req, res) => {
  try {
    console.log(" varify payment")
    console.log("req.body", req.body)
    const body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id
    console.log("body : : : ", body)
    var expectedSignature = crypto.createHmac("sha256", "vZ035cWAKANlYeO7bZxShcNT"); //hash key creating
    await expectedSignature.update(body.toString());
    expectedSignature = await expectedSignature.digest("hex");
    if (expectedSignature == req.body.response.razorpay_signature) {
      const balanceAmount = req.body.totalAmount - req.body.amount
      await Booking.updateOne({ _id: req.body.bookingId }, { $set: { advanceAmount: req.body.amount } })
      console.log("successs")
      return res.send({ success: true })
    } else {
      console.log("signature invalid")
      return res.status(500).json({ success: false })
    }

  } catch (error) {
    console.log("bookingList : ", error.message)
  }
}
// ------------------------------------------ Get booking req in vendor Side ---------------------------------------------

const Bookings = async (req, res) => {
  try {
    console.log('req.id hello: ', req.id)
    console.log("getting booking list")
    const searchData = req.query.search
    console.log("serachdata : ", searchData)

    let query = { bookingStatus: false }
    if (searchData) {
      query = {
        bookingStatus: false,
        $or: [
          { name: { $regex: searchData, $options: "i" } },
          { place: { $regex: searchData, $options: "i" } },
          { eventDate: { $regex: searchData, $options: "i" } },
          { email: { $regex: searchData, $options: "i" } }
        ]
      };
    }
    const BookingData = await Booking.find(query).populate('studio').populate('user').populate('categories.categoryId')
    const BookingDatas = BookingData.filter(booking => booking.studio.vendorId.toString() === req.id.toString());
    console.log("filteredBookingDatas : ", BookingDatas)
    console.log(BookingDatas.length)
    if (BookingDatas.length < 1) {
      console.log("no vendorlists")
      res.status(200).json({ success: true, message: "No datas found" })

    } else {
      console.log("eheeeee")
      return res.status(200).json({ success: true, BookingDatas })
    }
  } catch (error) {
    console.log("bookings: ", error.message);

  }
}

// ---------------------------------------------------sent Mail--------------------------------------------------------------

const sendOTP = async (email,message) => {
  // Create transporter object to send email
  console.log("enetered sendOtp to mail")
  const transporter = nodemailer.createTransport({
    host: "smpt.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    service: "Gmail",
    auth: {
      user:"jithinchackopayyanat@gmail.com",
      pass:"pexpekvbwxmqujlh",
    },
  });
  const mailOptions = {
    from: "jithinchackopayyanat@gmail.com",
    to: email,
    subject: "OTP Verification",
    html: `<h4 style='black'>${message}</h4>`,
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

// ------------------------------------------ Accept booking studio by user in vendor side ---------------------------------------------

const acceptBooking = async (req, res) => {
  try {
    console.log("accept bookings")
    console.log("req.email : ",req.body.email)
    const email = req.body.email
    const message = 'Your Request Accepted by the Vendor. You can Now make payment to the vendor.'
    console.log("req.id ", req.query.id)
    sendOTP(email,message);
    const updateBookings = await Booking.updateOne({ _id: req.query.id }, { $set: { bookingStatus: true } })
    res.status(200).json({ success: true, updateBookings })

  } catch (error) {
    console.log("accept bookings: ", error.message);
  }
}
// ------------------------------------------------------------upcoming events ---------------------------------------------

const upcomingEvents = async (req, res) => {
  try {
    console.log("entered upcomingreues")
    console.log('req.id hello: ', req.id)
    const searchData = req.query.search
    console.log("serachdata : ", searchData)

    let query = { bookingStatus: true }
    if (searchData) {
      query = {
        bookingStatus: true,
        $or: [
          { name: { $regex: searchData, $options: "i" }},
          { place: { $regex: searchData, $options: "i" }},
          { eventDate: { $regex: searchData, $options: "i" }},
          { email: { $regex: searchData, $options: "i"}}
        ]
      };

    }
    query.workStatus = false;
    query.advanceAmount = { $exists: true };
    const BookingData = await Booking.find(query).populate('studio').populate('user').populate('categories.categoryId')
    // console.log("bookingdata 1 : : : ",: ])
    const BookingDatas = BookingData.filter(booking => booking.studio.vendorId.toString() === req.id.toString());
    console.log("filteredBookingDatas : ", BookingDatas)
    console.log(BookingDatas.length)
    if (BookingDatas.length < 1) {
      console.log("no vendorlists")
      res.status(200).json({ success: true, message: "No datas found" })

    } else {
      console.log("eheeeee")
      return res.status(200).json({ success: true, BookingDatas })
    }
  } catch (error) {
    console.log("bookings: ", error.message);
  }
}

// ------------------------------------------------------------unPaid Bookings---------------------------------------------

const unpaidBookings = async (req, res) => {
  try {
    console.log("entered unpaiad")
    console.log('req.id hello: ', req.id)
    const searchData = req.query.search
    console.log("serachdata : ", searchData)

    let query = { bookingStatus: true }
    if (searchData) {
      query = {
        bookingStatus: true,
        $or: [
          { name: { $regex: searchData, $options: "i" } },
          { place: { $regex: searchData, $options: "i" } },
          { eventDate: { $regex: searchData, $options: "i" } },
          { email: { $regex: searchData, $options: "i" } }
        ]
      };

    }
    query.advanceAmount = { $exists: false };

    const BookingData = await Booking.find(query).populate('studio').populate('categories.categoryId')
    const BookingDatas = BookingData.filter(booking => booking.studio.vendorId.toString() === req.id.toString());
    console.log("filteredBookingDatas : ", BookingDatas)
    console.log(BookingDatas.length)
    if (BookingDatas.length < 1) {
      console.log("no vendorlists")
      res.status(200).json({ success: true, message: "No datas found" })

    } else {
      console.log("eheeeee")
      return res.status(200).json({ success: true, BookingDatas })
    }
  } catch (error) {
    console.log("bookings: ", error.message);
  }
}

// ------------------------------------------------------------Finish Work---------------------------------------------

const finishWork = async (req, res) => {
  try {
    console.log("finished work bookings")
    console.log("req.id ", req.query.id)
    const updateBookings = await Booking.updateOne({ _id: req.query.id }, { $set: { workStatus: true } })
    res.status(200).json({ success: true, updateBookings })

  } catch (error) {
    console.log("accept bookings: ", error.message);
  }
}

// ------------------------------------------------------------Work History---------------------------------------------


const workHistory = async (req, res) => {
  try {
    console.log("entered work hsitory")
    console.log('req.id hello: ', req.id)
    const searchData = req.query.search
    console.log("serachdata : ", searchData)

    let query = { workStatus:true }
    if (searchData) {
      query = {
        bookingStatus: true,
        $or: [
          { name: { $regex: searchData, $options: "i" } },
          { place: { $regex: searchData, $options: "i" } },
          { eventDate: { $regex: searchData, $options: "i" } },
          { email: { $regex: searchData, $options: "i" } }
        ]
      };

    }

    const BookingData = await Booking.find(query).populate('studio').populate('categories.categoryId')
    const BookingDatas = BookingData.filter(booking => booking.studio.vendorId.toString() === req.id.toString());
    console.log("filteredBookingDatas : ", BookingDatas)
    console.log(BookingDatas.length)
    if (BookingDatas.length < 1) {
      console.log("no vendorlists")
      res.status(200).json({ success: true, message: "No datas found" })

    } else {
      console.log("eheeeee")
      return res.status(200).json({ success: true, BookingDatas })
    }
  } catch (error) {
    console.log("bookings: ", error.message);
  }
}
module.exports = {
  bookingRequest,
  Bookings,
  acceptBooking,
  bookingList,
  payment,
  VarifyPayment,
  upcomingEvents,
  unpaidBookings,
  finishWork,
  workHistory,
  bookingHistory
}
