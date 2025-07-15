const { default: mongoose } = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // Bắt buộc phải có
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    discountPercentage: {
        type: Number,
        default: 0, // Giá trị mặc định nếu không được cung cấp
    },
    stock: {
        type: Number,
        default: 0,
    },
    thumbnail: {
        type: String,
    },
    status: {
        type: String,
        default: 'active', // Giá trị mặc định là 'active'
    },
    position: {
        type: Number,
    },
    deleted: {
        type: Boolean,
        default: false, // Mặc định là chưa bị xóa
    },
    deleteAt: Date,
    slug: { type: String, slug: "title", unique: true }
},
    {
        // Tùy chọn này sẽ tự động thêm 2 trường createdAt và updatedAt
        timestamps: true,
    }
);
const Product = mongoose.model('Product', productSchema, "products")
module.exports = Product;