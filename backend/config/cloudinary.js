const cloudinary = require('cloudinary').v2;

//configure cloudinary
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINAry_API_SECRET,
});

const uploadImage = async(File, folder= 'GLOBEX') => {
    try{
        const result = await cloudinary.uploader.upload(File.path, {
            folder: folder,
            resource_type : 'auto',
            transformation : [
                {width : 800 , height : 800 , crop: 'limit'},
                {quality: 'auto:good'},
                {format: 'jpg'}
            ]
        });
        return{
            URL : result.secure_url,
            publicID : result.public_id
        };
    }catch(error){
        console.error('Cloudinary upload error: ', error);
        throw new Error('Image upload failed');
    }
};

const deleteImage = async (publicID) => {
    try{
        await cloudinary.uploader.destroy(publicID);
    } catch (error){
        console.error('Cloudinry delete error:', error);
    }
};

module.exports = {
    cloudinary,
    uploadImage,
    deleteImage
};