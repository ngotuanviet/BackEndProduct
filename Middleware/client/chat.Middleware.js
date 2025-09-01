const RoomChat = require("../../models/rooms-chat.model");

module.exports.isAccess = async (req, res, next) => {
  const { roomChatID } = req.params;
  const myUserID = res.locals.user.id;
  const existUserInRoomChat = await RoomChat.findOne({
    _id: roomChatID,
    deleted: false,
    "users.userID": myUserID,
  });

  if (existUserInRoomChat) {
    next();
  } else {
    res.redirect("/");
  }
};
