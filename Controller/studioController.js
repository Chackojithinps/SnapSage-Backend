const { json } = require('express')
const Category = require('../Models/categoryModel')

const getCategories = async(req,res)=>{
    try {
        console.log("entered getCategories addStudio")
        const categoryDatas = await Category.find()
        console.log("categoryDatas : ",categoryDatas)
        res.status(200).json({categoryDatas})
    } catch (error) {
        console.log("getCategories addStudio",error.message)
    }
}

const addStudio = async(req,res)=>{
    try {
        console.log("entered add Studio")
        console.log("req.body items : ",req.body)
    } catch (error) {
        console.log("addStudio : ", error.message)
    }
}
module.exports = {
    getCategories,
    addStudio
}