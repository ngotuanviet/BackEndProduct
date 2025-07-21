const { default: mongoose } = require("mongoose");

mongoose.plugin(slug);
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
    deleteAt: Date,

},
    {
        // Tùy chọn này sẽ tự động thêm 2 trường createdAt và updatedAt
        timestamps: true,
    }
);
const Role = mongoose.model('role', roleSchema, "roles")
module.exports = Role;