const { default: mongoose } = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const categories_posts_Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // Bắt buộc phải có
    },
    parent_id: {
        type: String,
        default: "" // Bắt buộc phải có
    },
    body: {
        type: String,
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
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
        }

    },
    updatedBy: [{
        account_id: String,
        updatedAt: {
            type: Date,
        }
    }],
    deleteBy: {
        account_id: String,
        deletedAt: {
            type: Date,
        }
    },
    deleteAt: Date,
    slug: { type: String, slug: "title", unique: true }
},
    {
        // Tùy chọn này sẽ tự động thêm 2 trường createdAt và updatedAt
        timestamps: true,
    }
);
const Categories_posts = mongoose.model('categories-posts', categories_posts_Schema, "Categories-posts")
module.exports = Categories_posts;