const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
let streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "image",
                folder: "products", // Tạo folder để quản lý
                transformation: [
                    { width: 800, height: 600, crop: "limit" }, // Resize ảnh
                    { quality: "auto" } // Tự động tối ưu chất lượng
                ]
            },
            (error, result) => {
                if (result) {
                    console.log("Upload successful:", result.secure_url);
                    resolve(result);
                } else {
                    console.error("Upload error:", error);
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};
const uploadToCloudinary = async (buffer) => {
    try {
        let result = await streamUpload(buffer);
        return result.secure_url
    } catch (error) {
        console.error("Upload failed:", error);
        throw error;
    }
}
module.exports = uploadToCloudinary

