const express = require('express')
const jwt = require('jsonwebtoken')

const userAuth = (req,res,next)=>{
    try {
        console.log("UserAuth entered")
        console.log(req.headers)
        const token = req.headers[`authorization`]
        console.log("token in userAuth : ",token)
        const tokenwithoutBearer = token.split(" ")[1]
        console.log("kkkkkkkkkkkkkk", tokenwithoutBearer)
        jwt.verify(tokenwithoutBearer,process.env.JWT_SECRET_KEY,(err,encoded)=>{
            if(err){
                console.log("auth Failed",err.message)
                return res.status(401).send({message:"Auth Failed",success:false})
            }else{
                req.id = encoded.id
                next()
            }
        })
    } catch (error) {
        console.log("userAuth : ",error.message)
    }
}
module.exports = {userAuth}