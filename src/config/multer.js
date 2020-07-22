const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

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