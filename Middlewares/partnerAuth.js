const jwt = require('jsonwebtoken')
const partnerAuth = (req,res,next)=>{
    try {
        console.log("partnerAuth entered")
        console.log(req.headers)
        const token = req.headers[`authorization`]
        console.log("token in partnerAuth : ",token)
        const tokenwithoutBearer = token.split(" ")[1]
        jwt.verify(tokenwithoutBearer,process.env.JWT_VENDOR_SECRET_KEY,(err,encoded)=>{
            if(err){
                console.log("auth Failed",err.message)
                return res.status(401).send({message:"Auth Failed",success:false})
            }else if (encoded.role === 'vendor'){
                console.log("partner : ")
                req.id = encoded.id
                next()
            }
        })
    }catch (error) {
        console.log("partner auth failed : ",error.message)
    }
}
module.exports = {partnerAuth}