const { default: mongoose } = require("mongoose");
const generate = require("../helper/generate");
const roomChatSchema = new mongoose.Schema(
  {
    title: String,
    avatar: String,
    typeRoom: String,
    status: String,
    theme_id: String,
    users: [
      {
        userID: String,
        // quyền thành viên nhóm
        role: String,
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
const RoomChat = mongoose.model("roomChat", roomChatSchema, "rooms-chat");
module.exports = RoomChat;
