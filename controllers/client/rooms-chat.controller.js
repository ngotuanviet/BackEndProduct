const RoomChat = require("../../models/rooms-chat.model");
const Users = require("../../models/Users.model");

const index = (req, res) => {
  res.render("client/pages/rooms-chat", {
    title: "Phòng chat",
  });
};
const create = async (req, res) => {
  const users = res.locals.user.friendsList;
  const friendsID = users.map((item) => item.user_ID);
  const infosFriends = await Users.find({
    _id: { $in: friendsID },
    deleted: false,
  }).select(" fullName avatar");

  res.render("client/pages/rooms-chat/create", {
    title: "Tạo phòng chat",
    friends: infosFriends,
  });
};
const createPost = async (req, res) => {
  const { title, usersId } = req.body;

  const newRoom = {
    title,
    typeRoom: "Group",
    users: [],
  };
  if (Array.isArray(usersId)) {
    for (const userID of usersId) {
      newRoom.users.push({ userID, role: "member" });
    }
  } else {
    newRoom.users.push({ userID: usersId, role: "member" });
  }

  newRoom.users.push({ userID: res.locals.user.id, role: "superAdmin" });
  const chatRoom = new RoomChat(newRoom);
  await chatRoom.save();
  res.redirect(`/chat/${chatRoom.id}`);
};
module.exports = {
  index,
  create,
  createPost,
};
