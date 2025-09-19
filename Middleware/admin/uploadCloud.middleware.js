const uploadToCloudinary = require("../../helper/uploadCloudinary");

const collectFiles = (files) => {
  if (!files) {
    return [];
  }
  if (Array.isArray(files)) {
    return files;
  }
  return Object.values(files).reduce((all, current) => all.concat(current), []);
};

module.exports.upload = async (req, res, next) => {
  const files = collectFiles(req.files);

  if (files.length === 0) {
    return next();
  }

  try {
    const uploads = await Promise.all(
      files.map(async (file) => {
        if (!file || !file.buffer) {
          return null;
        }

        const url = await uploadToCloudinary(file.buffer);
        return { fieldname: file.fieldname, url };
      })
    );

    uploads.forEach((upload) => {
      if (!upload || !upload.fieldname) {
        return;
      }

      req.body[upload.fieldname] = upload.url;
    });

    next();
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    next(error);
  }
};
