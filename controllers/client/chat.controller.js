const Chats = require("../../models/Chats.model");
const RoomChat = require("../../models/rooms-chat.model");
const Users = require("../../models/Users.model");
const chatSocket = require("../../sockets/client/chat.socket");

const index = async (req, res) => {
  chatSocket(res);
  const { roomChatID } = req.params;

  // lấy data
  const chats = await Chats.find({
    room_chat_id: roomChatID,
    deleted: false,
  });
  chats.titleRoom = await RoomChat.findOne({
    deleted: false,
    _id: roomChatID,
  }).select("title");

  for (const chat of chats) {
    const infoUser = await Users.findOne({ _id: chat.user_id }).select(
      "fullName"
    );
    if (infoUser) {
      chat.fullName = infoUser.fullName;
    }
  }
  // end
  console.log("====================================");
  console.log(chats);
  console.log("====================================");
  res.render("client/pages/chat/index", {
    title: "Chat",
    chats,
    roomChatID,
  });
};
module.exports = {
  index,
};
