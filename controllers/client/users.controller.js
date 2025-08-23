const Users = require("../../models/Users.model");
const usersSocket = require("../../sockets/client/users.socket");
// [GET] users/not-Friend
const notFriend = async (req, res) => {
  const userID = res.locals.user.id;
  const userIDFriend = req.query.userID;
  console.log(userIDFriend);
  usersSocket(res);
  const myUser = await Users.findOne({ _id: userID });
  const requestFriends = myUser.requestFriends;
  const acceptFriends = myUser.acceptFriends;

  const users = await Users.find({
    $and: [
      {
        _id: { $ne: userID },
      },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } },
    ],
    deleted: false,
    status: "active",
  }).select("fullName avatar");

  res.render("client/pages/users/not-friend", {
    title: "Danh sách người dùng",
    users,
  });
};
// [GET] users/request
const request = async (req, res) => {
  const myUserID = res.locals.user.id;
  const myUser = await Users.findOne({ _id: myUserID });
  const requestFriends = myUser.requestFriends;
  usersSocket(res);
  arrayInfoUser = [];
  for (const item of requestFriends) {
    const infoUserAddFriends = await Users.findOne({ _id: item }).select(
      "fullName avatar"
    );
    arrayInfoUser.push(infoUserAddFriends);
  }

  res.render("client/pages/users/request", {
    title: "Lời mời đã gửi",
    users: arrayInfoUser,
  });
};
// [GET] users/accept
const accept = async (req, res) => {
  const myUserID = res.locals.user.id;
  const myUser = await Users.findOne({ _id: myUserID });
  const requestFriends = myUser.acceptFriends;
  usersSocket(res);
  arrayInfoUser = [];

  for (const item of requestFriends) {
    const infoUserAddFriends = await Users.findOne({ _id: item }).select(
      "fullName avatar"
    );

    arrayInfoUser.push(infoUserAddFriends);
  }
  res.render("client/pages/users/accept", {
    title: "Lời mời đã nhận",
    users: arrayInfoUser,
  });
};
const friends = async (req, res) => {
  const myUserID = res.locals.user.id;
  const myUser = await Users.findOne({ _id: myUserID });
  const friendList = myUser.friendsList;
  const friendListID = friendList.map((item) => item.user_ID);
  usersSocket(res);

  const infoUserFriends = await Users.find({
    _id: friendListID,
  }).select("fullName avatar statusOnline");

  console.log(infoUserFriends);
  res.render("client/pages/users/friends", {
    title: "Danh sách bạn bè",
    users: infoUserFriends,
  });
};

module.exports = {
  notFriend,
  request,
  accept,
  friends,
};
