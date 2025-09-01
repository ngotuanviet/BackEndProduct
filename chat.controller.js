const Chats = require("../../models/Chats.model");
const Users = require("../../models/Users.model");
// Socket handlers are initialized once in index.js
// [GET] /chat/:roomChatID
const index = async (req, res) => {
  const { roomChatID } = req.params;
  // lấy data
  const chats = await Chats.find({
    room_chat_id: roomChatID,
    deleted: false,
  });
  for (const chat of chats) {
    const infoUser = await Users.findOne({ _id: chat.user_id }).select(
      "fullName"
    );
    if (infoUser) {
      chat.fullName = infoUser.fullName;
    }
  }
  // end

  res.render("client/pages/chat/index", {
    title: "Chat",
    chats,
    roomChatID,
  });
};
module.exports = {
  index,
};
