const uploadToCloudinary = require('../../helper/uploadCloudinary');

module.exports.upload = async (req, res, next) => {

    if (req.file) {
        try {
            const link = await uploadToCloudinary(req.file.buffer);
            req.body[req.file.fieldname] = link; // Gán link ảnh vào req.body
        } catch (error) {
            console.log(error)
            return next(error);
        }
    }
    next();

}
