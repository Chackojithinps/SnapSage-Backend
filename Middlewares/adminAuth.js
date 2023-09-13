const jwt = require('jsonwebtoken')
const adminAuth = (req,res,next)=>{
    try {
        console.log("admin entered")
        console.log(req.headers)
        const token = req.headers[`authorization`]
        console.log("token in userAuth : ",token)
        const tokenwithoutBearer = token.split(" ")[1]
        jwt.verify(tokenwithoutBearer,process.env.JWT_ADMIN_SECRET_KEY,(err,encoded)=>{
            if(err){
                console.log("auth Failed",err.message)
                return res.status(401).send({message:"Auth Failed",success:false})
            }else if(encoded.role == 'admin'){
                // req.id = encoded.id
                next()
            }
        })
    }catch (error) {
        console.log("partner auth failed : ",error.message)
    }
}
module.exports = {adminAuth}