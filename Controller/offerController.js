const Offer = require('../Models/offerModel')

// ------------------------------------------------------------get Offers by User ---------------------------------------------------------

const getOffers = async (req,res)=>{
    try {
        console.log("entered getOffer")
        console.log("rq.oid : ",req.query.id)
        const offerDatas = await Offer.find({vendor:req.query.id})
        console.log("offerDatas; : ",offerDatas)
        res.status(200).json({success:true,offerDatas})
    } catch (error) {
        console.log("error in offeradd : ",error.message)
    }
}

// ------------------------------------------------------------Add Offer by vendor --------------------------------------------------------
const addOffer = async (req,res)=>{
    try {
        console.log("entered addoffer")
        console.log("input : ",req.body.input)
        const offerData = req.body.input
        console.log(req.id)
        const addOffer = new Offer({
            vendor:req.id,
            offerName:offerData.offerName,
            percentage:offerData.percentage,
            description:offerData.description
        })
        await addOffer.save()
        res.status(200).json({success:true})
    } catch (error) {
        console.log("error in offeradd : ",error.message)
    }
}

module.exports = {
    addOffer,
    getOffers
}