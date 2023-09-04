const Booking = require('../Models/bookingSchema');
const Photos = require('../Models/photoSchema')
const Studio = require('../Models/StudioModel')

// ------------------------------------------booking req by user ---------------------------------------------

const bookingRequest = async (req, res) => {
  try {
    console.log("entered booking");
    console.log(req.id)
    const { name, message, email, phone, eventDate,totalAmount, categories ,studioId } = req.body;
    console.log("req.body : ",req.body)
    const bookingData = new Booking({
      user:req.id,
      studio:studioId,
      name,
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

// ------------------------------------------Get booking req in vendor Side---------------------------------------------

const Bookings = async (req,res) =>{
    try {
        console.log("getting booking list")  
        const searchData = req.query.search
        console.log("serachdata : ",searchData)
        
        let query={bookingStatus:false}
        if(searchData){
           query = {
            bookingStatus: false,
            $or: [
              { name: { $regex: searchData, $options: "i" }}, 
              { place: { $regex: searchData, $options: "i" }}, 
              { eventDate: { $regex: searchData, $options: "i" }}, 
              { email: { $regex: searchData, $options: "i" }}
            ]
          };
        }
        const BookingDatas = await Booking.find(query).populate('categories.categoryId')
        console.log("bookingDatas : ",BookingDatas)
        console.log(BookingDatas.length)
        if(BookingDatas.length<1){
          console.log("no vendorlists")
           res.status(200).json({success:true,message:"No datas found"})
    
        }else{
          console.log("eheeeee")
          return res.status(200).json({success:true,BookingDatas})
        }
    } catch (error) {
        console.log("bookings: ", error.message);

    }
}

// ------------------------------------------Accept booking studio by user in vendor side---------------------------------------------

const acceptBooking = async(req,res)=>{
    try {
        console.log("accept bookings")
        console.log("req.id ",req.query.id)
        const updateBookings = await Booking.updateOne({_id:req.query.id},{$set:{bookingStatus:true}})
        res.status(200).json({success:true,updateBookings})

    } catch (error) {
        console.log("accept bookings: ", error.message);
    }
}

// ------------------------------------------Get booked list in user Side---------------------------------------------

const bookingList = async(req,res) =>{
  try {
    console.log(" bookings List")
    console.log("req.id ",req.id)
    const BookingList = await Booking.find({user:req.id}).populate('studio').populate('categories.categoryId').exec();
    await Studio.populate(BookingList, {
      path: 'studio.images',
      model: 'photos'
    });
    
    console.log("BookingList : ",BookingList)
    // const photos = await Photos.findOne({studioId:BookingList.studio._id})
    // console.log("Photos : ",photos)
    res.status(200).json({success:true,BookingList})
  } catch (error) {
    console.log("bookingList : ",error.message)
  }
}

const payment = async(req,res)=>{
  try {
      console.log("entetered payment")
      
  } catch (error) {
    console.log("payment",error.message)
  }
}


module.exports = {
  bookingRequest,Bookings,acceptBooking,bookingList
}
