const Category = require('../Models/categoryModel')


// --------------------------------------Add Category ------------------------------

const addCategory = async(req,res)=>{
    try {
        console.log("reached category")
        const {category} = req.body
        console.log(category)
        const categoryDetails = await Category.findOne({categoryName:category})
        if(categoryDetails){
            return res.status(200).json({exists:true,message:"Category already Exists"})
        }
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
        console.log(req.query.id);
        console.log(category)
        const categoryDatas = await Category.findOneAndUpdate({_id:req.query.id},{$set:{categoryName:category}})
        res.status(200).json({message:"Category successfully added",categoryDatas})
    } catch (error) {
        console.log("addCategoy : ",error.message)
    }
}

module.exports= {
    addCategory,getCategories,editCategory
}