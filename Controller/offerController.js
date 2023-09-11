const Offer = require('../Models/offerModel')

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
    addOffer
}