const multer = require("multer")
const cloudinary = require("../config/cloudinary")
const errorHandler = require("../utils/errorHandler")
const { v4: uuidv4 } = require("uuid")

//generate uuid

const generate_uuid = () => {
    return uuidv4();
  };



const uploadImage = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10_000_000 }, //max 10 mb
    fileFilter: (req, file, cb) => {
        if(file.mimetype.startsWith('image/')){
            cb(null, true);
        }
        else{
            cb(new errorHandler("Upload a valid image", 400), false)
        }
    }
}).single('image')

module.exports = uploadImage