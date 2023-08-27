const Vendor = require('../Models/vendorModel')
const Studio = require('../Models/StudioModel')
const StudioImg = require('../Models/photoSchema')
const cloudinary = require('../Config/Cloudinary')
const category = require('../Models/categoryModel')
// ----------------------------------------------Get the studios lists --------------------------------------

const getStudios =  async(req,res)=>{
    try {
        console.log("entered getStudio________________________________________________")
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
        const studioId  = req.query.id;
        console.log("req.paramas : ",studioId)
        const studio = await Studio.findById(studioId).populate({
            path: 'category.categories',
            model: 'category'
        });
        const populatedCategories = studio.category.map(category => {
            const categoires = category.categories
            return {
                ...category,
                categories: categoires
            };
        });

        const categoryDatas = populatedCategories.map((item)=>(
             item.categories
        ))
       

        res.status(200).json({ categoryDatas });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
}

// -----------------------------------------Image Upload for each studios ------------------------------------


const uploadImages = async(req,res)=>{
    try {
        console.log("entered upload images in imagecontroller")
        const vendorId = req.id;
        const studioId = req.body.studioId
        console.log("req.body : ",req.body)
        console.log("studioId : ",studioId)
        
        const categoryData = JSON.parse(req.body.categoryData);
        const fileDetails = req.files;
        let savedPhotos;
        console.log("fileDetails : ",fileDetails)
        const uploadedImages = [];
        for (const category of categoryData) {
            const categoryImages = category.images;
            const uploadedCategoryImages = [];
            for (const imageName of categoryImages) {
                const imageData = fileDetails.find((item) => item.originalname === imageName);
                console.log("imageData : " ,imageData)
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
        console.log("uploaded Images are : ",uploadedImages)

        const existingStudio = await StudioImg.findOne({ studioId: studioId});
        console.log("existingDoc : ",existingStudio)
       
        if (existingStudio) {
            const updatedImages = existingStudio.images.map((item) => {
                const matchingUploadedItem = uploadedImages.find((uploadedItem) => uploadedItem.categoryId.toString() === item.categoryId.toString());
                if (matchingUploadedItem) {
                    return {
                        categoryId: item.categoryId,
                        photos: [...item.photos, ...matchingUploadedItem.photos],
                    };
                } else {
                    return item.toObject();
                }
            });
               
            console.log("updated Images : ",updatedImages)
            const unmatchedUploadedItems = uploadedImages.filter((uploadedItem) =>
            !existingStudio.images.some((item) => item.categoryId.toString() === uploadedItem.categoryId.toString())
        );
            console.log("unmatcheduploaded items : ",unmatchedUploadedItems)

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
             savedPhotos=await studioImages.save()
             console.log("savedPhotos : ",savedPhotos)
             const idsved = savedPhotos._id;
             console.log(" id of savd : ",idsved)
             const k = await Studio.updateOne({_id:studioId},{$set:{images:idsved}})
          
             console.log("studioDetals : ",k)
        }
         res.status(200).json({success:true})
    } catch (error) {
        console.log("upload image error : ", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// -------------------------------------------------getStudioImages -------------------------------------------------

const getStudioImages = async(req,res)=>{
    try {
        const studioId = req.query.id
        console.log("req.id of getSTudioImages: ", studioId )
        const studioDatas = await StudioImg.findOne({ studioId: studioId }).populate("images.categoryId")
        console.log("________________________ : ",studioDatas)
        const categoryDataWithImages = studioDatas.images.map((imageItem)=>(
             imageItem
        ))
        console.log("****************",categoryDataWithImages)
        res.status(200).json({success:true,categoryDataWithImages})
    } catch (error) {
        console.log("getStudioImages : ",error.message)
    }
}
module.exports = {
    getStudios,
    getCategories,
    uploadImages,
    getStudioImages
}