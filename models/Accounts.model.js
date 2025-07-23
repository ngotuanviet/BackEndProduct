const { default: mongoose } = require("mongoose");
const generate = require("../helper/generate");
const AccountSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true, // Bắt buộc phải có
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        required: true, // Bắt buộc phải có
    },
    token: {
        type: String,
        default: generate(100), // Tạo token mặc định
    },
    phone: {
        type: String
    },
    role_id: {
        type: String,
    },
    avatar: {
        type: String,
    },
    status: {
        type: String,
        default: 'active', // Giá trị mặc định là 'active'
    },
    deleted: {
        type: Boolean,
        default: false, // Mặc định là chưa bị xóa
    },
    deleteAt: Date,

},
    {
        // Tùy chọn này sẽ tự động thêm 2 trường createdAt và updatedAt
        timestamps: true,
    }
);
const Accounts = mongoose.model('Account', AccountSchema, "accounts")
module.exports = Accounts;