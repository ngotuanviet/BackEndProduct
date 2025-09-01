const { default: mongoose } = require("mongoose");
const generate = require("../helper/generate");
const chatsSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true, // Bắt buộc phải có
    },
    room_chat_id: {
      type: String,
    },
    content: {
      type: String,
    },
    images: {
      type: Array,
    },
    avatar: {
      type: String,
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
const Chats = mongoose.model("chats", chatsSchema, "chats");
module.exports = Chats;
