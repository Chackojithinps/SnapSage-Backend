const express = require('express')
const jwt = require('jsonwebtoken')

const userAuth = (req, res, next) => {
    try {
        console.log("UserAuth entered")

        const token = req.headers[`authorization`]
        console.log("token in userAuth : ", token)
        const tokenwithoutBearer = token.split(" ")[1]
        console.log("kkkkkkkkkkkkkk", tokenwithoutBearer)
        jwt.verify(tokenwithoutBearer, process.env.JWT_USER_SECRET_KEY, (err, encoded) => {
            console.log("encoded : ", encoded)
            if (err) {
                console.log("auth Failed", err.message)
                return res.status(401).send({ message: "Auth Failed", success: false })
            } else if (encoded.role == "user") {
                if (encoded.exp && Date.now() >= encoded.exp * 1000) {
                    return res.status(200).send({ success: true, message: "token expired" })
                } else {
                    console.log("entered encoded code")
                    req.id = encoded.id
                    next()
                }
            }
        })
    } catch (error) {
        console.log("userAuth : ", error.message)
    }
}
module.exports = { userAuth }