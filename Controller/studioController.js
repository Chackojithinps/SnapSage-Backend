const Category = require('../Models/categoryModel')
const Studio = require('../Models/StudioModel')

// -------------------------------------------- get Categories for studio ----------------------------
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

// -------------------------------------------- Add Studios  -----------------------------------------

const addStudio = async(req,res)=>{
    try {
        console.log("entered add Studio")
        // console.log(req.id)
        console.log("req.body items : ",req.body)
        const { studioName, description,email, district, zipcode, categories,city} = req.body;
        const newStudio = new Studio({
            companyName: studioName,
            description: description,
            district: district,
            email:email,
            city: city,
            pin: zipcode,
            vendorId:req.id,
            category: categories.map(category => ({
                categories: category.categoryId,
                price: category.price,
            })),

            isBlocked: false // You might want to set this explicitly
        });
        const savedStudio = await newStudio.save();
        res.status(200).json({success:true})
    } catch (error) {
        console.log("addStudio : ", error.message)
    }
}

module.exports = {
    getCategories,
    addStudio
}