const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

//configure the directory where the temporary images will be saved before uploading them into the cloudinary server
const config = {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'temp'),
        filename: (req, file, callback) => {
            const fileName = `${crypto.randomBytes(8).toString('hex')}-${file.originalname}`;
            callback(null, fileName);
        }
    }),
}

module.exports = config;