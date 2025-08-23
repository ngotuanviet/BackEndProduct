const { default: mongoose } = require("mongoose");
const generate = require("../helper/generate");
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    token: {
      type: String,
      default: generate.generateRandomString(100), // Tạo token mặc định
    },
    phone: {
      type: String,
    },
    avatar: {
      type: String,
    },
    requestFriends: Array, // lời mời đã gửi
    acceptFriends: Array, // lời mời đã nhận
    friendsList: [
      // danh sách bạn bè
      {
        user_ID: String,
        room_chat_id: String,
      },
    ],
    status: {
      type: String,
      default: "active", // Giá trị mặc định là 'active'
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
const Users = mongoose.model("users", userSchema, "users");
module.exports = Users;
