const Category = require('../Models/categoryModel')


// --------------------------------------Add Category ------------------------------

const addCategory = async(req,res)=>{
    try {
        console.log("reached category")
        const {category} = req.body
        console.log(category)
        const categoryData = new Category({
            categoryName:category
        })
        await categoryData.save()
        res.status(200).json({message:"Category successfully added"})
    } catch (error) {
        console.log("addCategoy : ",error.message)
    }
}

// --------------------------------------get Category ------------------------------

const getCategories = async(req,res)=>{
    try {
        const categoryDatas = await Category.find()
        res.status(200).json({message:"Category successfully added",categoryDatas})
    } catch (error) {
        console.log("addCategoy : ",error.message)
    }
}

// --------------------------------------edit Category ------------------------------

const editCategory = async(req,res)=>{
    try {
        const {category} = req.body
        const categoryDatas = await Category.findOneAndUpdate({categoryName:categ})
        res.status(200).json({message:"Category successfully added",categoryDatas})
    } catch (error) {
        console.log("addCategoy : ",error.message)
    }
}
module.exports= {
    addCategory,getCategories,editCategory
}