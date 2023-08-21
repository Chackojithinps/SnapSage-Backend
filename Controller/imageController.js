const Vendor = require('../Models/vendorModel')
const Studio = require('../Models/StudioModel')
const Category = require('../Models/categoryModel')
const StudioImg = require('../Models/photoSchema')
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


// ----------------------------------------------- Get the categories of studios --------------------------------------

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
        const vendorId = req.id;
        const studioId = req.body.studioId
        console.log(req.body)
        const categoryData = JSON.parse(req.body.categoryData);
        const fileDetails = req.files;
        const uploadedImages = [];
        for (const category of categoryData) {
            const categoryImages = category.images;
            const uploadedCategoryImages = [];
            for (const imageName of categoryImages) {
                const imageData = fileDetails.find((item) => item.originalname === imageName);
                if(imageData){              
                    const result = await cloudinary.uploader.upload(imageData.path,{folder:'Studio categoryWise Images'});
                    uploadedCategoryImages.push(result.secure_url);
                }
            }
            uploadedImages.push({
                categoryId: category.categoryId,
                photos: uploadedCategoryImages
            });
           
        }
        const existingStudio = await StudioImg.findOne({ studioId: studioId});
        console.log("existingDoc : ",existingStudio)
       
        if (existingStudio) {
            // Create a new array to hold the updated images
            const updatedImages = existingStudio.images.map((item) => {
                const matchingUploadedItem = uploadedImages.find((uploadedItem) => uploadedItem.categoryId.toString() === item.categoryId.toString());
                console.log("------------[][][] : :  : ",matchingUploadedItem)
                if (matchingUploadedItem) {
                    // Merge the old and new photos for the category
                    return {
                        categoryId: item.categoryId,
                        photos: [...item.photos, ...matchingUploadedItem.photos],
                    };
                } else {
                    return item.toObject();
                }
            });
            console.log("updatedDataaaaaaaaaaaaaaaaa : ",updatedImages)
            const unmatchedUploadedItems = uploadedImages.filter((uploadedItem) =>
            !existingStudio.images.some((item) => item.categoryId.toString() === uploadedItem.categoryId.toString())
        );

        // Add unmatched categories to the existingStudio
        existingStudio.images = [...updatedImages, ...unmatchedUploadedItems];

        await existingStudio.save();

            console.log("Updated existingDoc : ", existingStudio);
        }
        
        else{
            console.log("helloooooooooooooo")
            const studioImages = new StudioImg({
                studioId,
                vendorId,
                images:uploadedImages,
             })
             await studioImages.save()
        }
      
         res.status(200).json({success:true})
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