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
        const oneTime = offerData.oneTime === 'true' ? true : false;
        const addOffer = new Offer({
            vendor:req.id,
            offerName:offerData.offerName,
            percentage:offerData.percentage,
            description:offerData.description,
            oneTime:oneTime
        })
        await addOffer.save()
        res.status(200).json({success:true})
    } catch (error) {
        console.log("error in offeradd : ",error.message)
    }
}

// ------------------------------------------------------------ get offer list for vendor --------------------------------------------------------

const getOfferstoVendor = async (req,res) =>{
    try {
        console.log("entered offerLists ")
        const partnerId = req.id
        console.log(partnerId)
        const offers = await Offer.find({vendor:partnerId})
        console.log("offers : : : ",offers)
        res.status(200).json({success:true,offers})
    } catch (error) {
        console.log("error in offeradd : ",error.message)
        
    }
}
// ------------------------------------------------------------ list Offer --------------------------------------------------------
const listOffer = async (req,res) =>{
    try {
        console.log("entered list ")
        console.log("reabody : ",req.body)

        const partnerId = req.id
        console.log(partnerId)
        const offers = await Offer.updateOne({_id:req.body.id},{$set:{isListed:true}})
        console.log("offers : : : ",offers)
        res.status(200).json({success:true,offers})
    } catch (error) {
        console.log("error in offeradd : ",error.message)
    }
}

// ------------------------------------------------------------ unlist Offer --------------------------------------------------------

const unlistOffer = async (req,res) =>{
    try {
        console.log("entered unlist--------------------- ")
        console.log("reabody : ",req.body)
        const partnerId = req.id
        console.log(partnerId)
        const offers = await Offer.updateOne({_id:req.body.id},{$set:{isListed:false}})
        console.log("offers : : : ",offers)

        res.status(200).json({success:true,offers})
    } catch (error) {
        console.log("error in offeradd : ",error.message)
        
    }
}
module.exports = {
    addOffer,
    getOffers,
    getOfferstoVendor,
    listOffer,
    unlistOffer
}