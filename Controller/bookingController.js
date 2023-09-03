const Booking = require('../Models/bookingSchema');

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
    // console.log(bookingData);

    res.status(201).json({ success: true, bookingData });
  } catch (error) {
    console.log("booking request: ", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

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

const bookingList = async(req,res) =>{
  try {
    console.log(" bookings List")
    console.log("req.id ",req.id)
    const BookingList = await Booking.findOne({user:req.id})
    console.log("BookingList : ",BookingList)
    res.status(200).json({success:true,BookingList})
  } catch (error) {
    console.log("bookingList : ",error.message)
  }
}
module.exports = {
  bookingRequest,Bookings,acceptBooking,bookingList
}
