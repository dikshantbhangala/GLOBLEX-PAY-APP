const multer = require('multer');
const path = require('path');

//configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file,cb){
        cb(null , 'uploads/');
    },
    filename: function(req, file , cb){
        //create unique filename
        const uniquesuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniquesuffix + path.extname(file.originalname));
    }
});

//configure multer
const upload  = multer({
    storage: storage,
    limits:{
        fileSize: 5*1024*1024,
        files: 5
    },
    fileFilter: fileFilter
});

//Middleware for different upload types
const uploadSingle = (fieldname) => upload.single(fieldname);
const uploadMultiple = (fieldname, maxCount = 5) => upload.array(fieldname,maxCount);
const uploadFields = (fields) => upload.fields(fields);

//KYC document upload configuration
const uploadKYCDocuments = upload.fields([
    {name : 'govermentIdFront' , maxCount: 1},
     {name : 'govermentIdBack' , maxCount: 1},
      {name : 'proofOfAddress' , maxCount: 1},
       {name : 'selfie' , maxCount: 1},
        {name : 'additionaldocuments' , maxCount: 1},
]);

//Profile picture upload
const uploadProfilePicture = upload.single('profilePicture');

//Error handling middleware for multer
const handleUploadError = (error,req,res,next) => {
    if(error instanceof multer.MulterError){
        if(error.code === 'LIMIT_FILE_SIZE'){
            return res.status(400).json({
                status: 'error',
                message: 'File too large. maximum size is 5MB.'
            });
        } else if(error.code === 'LIMIT_FILE_COUNT'){
            return res.status(400).json({
                status: 'error',
                message: 'Too many files. Maxiimum is 5 files.'
            });
        } else if(error.code === 'LIMIT_UNEXPECTED_FILE'){
            return res.status(400).json({
                status:'error',
                message:'Unexpected field in file upload.'
            });
        } else if(error){
            return res.status(400).json({
                status:'error',
                message: error.message
            });
        }
        next();
    };
}
module.exports = {
    upload,
    uploadSingle,
    uploadMultiple,
    uploadFields,
    uploadKYCDocuments,
    uploadProfilePicture,
    handleUploadError
};