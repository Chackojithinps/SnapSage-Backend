const Vendor = require('../Models/vendorModel')
const Studio = require('../Models/StudioModel')
const Category = require('../Models/categoryModel')
const cloudinary = require('../Config/Cloudinary')

// ----------------------------------------------Get the studios lists --------------------------------------

const getStudios =  async(req,res)=>{
    try {
        // console.log("entered getCategories addStudio")
        console.log("req.id :",req.id)
        const studioDatas = await Studio.find({vendorId:req.id})
        res.status(200).json({studioDatas})
    } catch (error) {
        console.log("getCategories addStudio",error.message)
    }
}


// ----------------------------------------------Get the categories of studios --------------------------------------

const getCategories = async (req, res) => {
    try {
        console.log("entered getCategories addStudio11");
        const studioId  = req.query.id;
        console.log("req.paramas : ",studioId)
        const studio = await Studio.findById(studioId).populate({
            path: 'category.categories', // Populate the categories field inside the category array
            model: 'category' // The name of the Category model
        });
        const populatedCategories = studio.category.map(category => {
            const categoires = category.categories
            return {
                ...category,
                categories: categoires
            };
        });
        // console.log("Populated Categories: ", populatedCategories);

        const categoryDatas = populatedCategories.map((item)=>(
             item.categories
        ))
       
        console.log("finalDatas : ",categoryDatas)

        res.status(200).json({ categoryDatas });
    } catch (error) {
        console.log("getCategories addStudio", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
}

// -----------------------------------------Image Upload for each studios ------------------------------------


const uploadImages = async(req,res)=>{
    try {
        console.log("entered upload images in imagecontroller")
        console.log("rq.body: ",req.body)
        console.log("rq.files: ",req.files)
        const categoryData = JSON.parse(req.body.categoryData);
        console.log("categories data ___________________________", categoryData)
        const fileDetails = req.files;
        // console.log("______________________ : ",fileDetails)
        const uploadedImages = [];

        for (const category of categoryData) {
            const categoryImages = category.images;
            const uploadedCategoryImages = [];
            for (const imageName of categoryImages) {
                console.log("imgData111111111111111111111111111",imageData)
                const result = await cloudinary.uploader.upload(imageData);
                uploadedCategoryImages.push(result.secure_url);
            }
            uploadedImages.push({
                categoryId: category.categoryId,
                images: uploadedCategoryImages
            });
        }
      console.log("))))))))))))  : ",uploadedImages)
        // res.status(200).json({ message: 'Images uploaded successfully' });
    } catch (error) {
        console.log("upload image error : ", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    getStudios,
    getCategories,
    uploadImages
}