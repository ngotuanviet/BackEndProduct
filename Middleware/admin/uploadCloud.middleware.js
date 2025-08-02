const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports.upload = (req, res, next) => {
    if (req.file) {
        console.log("File received:", req.file.originalname, "Size:", req.file.size);

        // Kiểm tra loại file
        if (!req.file.mimetype.startsWith('image/')) {
            req.flash('error', 'Vui lòng chọn file ảnh hợp lệ!');
            return res.redirect('back');
        }

        // Kiểm tra kích thước file (max 5MB)
        if (req.file.size > 5 * 1024 * 1024) {
            req.flash('error', 'File ảnh quá lớn! Vui lòng chọn file nhỏ hơn 5MB.');
            return res.redirect('back');
        }

        let streamUpload = (req) => {
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
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            try {
                let result = await streamUpload(req);
                req.body[req.file.fieldname] = result.secure_url; // Gán link ảnh vào req.body
                console.log("Image URL saved:", result.secure_url);
                next();
            } catch (error) {
                console.error("Upload failed:", error);
                req.flash('error', 'Lỗi khi upload ảnh: ' + error.message);
                return res.redirect('back');
            }
        }

        upload(req);
    } else {
        console.log("No file received");
        next(); // Nếu không có file thì đi tiếp
    }
};
