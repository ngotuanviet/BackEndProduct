const { default: mongoose } = require("mongoose");

const roleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // Bắt buộc phải có
    },
    description: {
        type: String,
    },
    permissions: {
        type: Array,
        default: [], // Mặc định là mảng rỗng nếu không có quyền nào
    },
    deleted: {
        type: Boolean,
        default: false, // Mặc định là chưa bị xóa
    },
    deleteBy: {
        account_id: String,
        deletedAt: Date
    },
    createdBy: {
        account_id: String,
        createdAt: Date
    },
    updatedBy: [{
        account_id: String,
        updatedAt: Date
    }],
    deleteAt: Date,

},
    {
        // Tùy chọn này sẽ tự động thêm 2 trường createdAt và updatedAt
        timestamps: true,
    }
);
const Role = mongoose.model('role', roleSchema, "roles")
module.exports = Role;