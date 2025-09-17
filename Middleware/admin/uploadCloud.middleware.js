const uploadToCloudinary = require("../../helper/uploadCloudinary");

module.exports.upload = async (req, res, next) => {
  if (req.files) {
    try {
      for (const key in req.files) {
        const files = req.files[key];
        if (files && files.length > 0) {
          const link = await uploadToCloudinary(files[0].buffer);
          req.body[key] = link;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  next();
};
