const Users = require("../../models/Users.model");
// [GET] users/not-Friend
const notFriend = async (req, res) => {
  const userID = res.locals.user.id;
  const userIDFriend = req.query.userID;
  console.log(userIDFriend);
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

  const users = await Users.find({
    _id: { $in: requestFriends },
    deleted: false,
  }).select("fullName avatar");

  res.render("client/pages/users/request", {
    title: "Lời mời đã gửi",
    users: users,
  });
};
// [GET] users/accept
const accept = async (req, res) => {
  const myUserID = res.locals.user.id;

  const myUser = await Users.findOne({ _id: myUserID });
  const acceptFriends = myUser.acceptFriends;

  const users = await Users.find({
    _id: { $in: acceptFriends },
    deleted: false,
    status: "active",
  }).select("fullName avatar");

  res.render("client/pages/users/accept", {
    title: "Lời mời đã nhận",
    users: users,
    myUserID: myUserID,
  });
};
const friends = async (req, res) => {
  const myUserID = res.locals.user.id;
  const myUser = await Users.findOne({ _id: myUserID });
  const friendList = myUser.friendsList;
  const friendListID = friendList.map((item) => item.user_ID);

  const infoUserFriends = await Users.find({
    _id: friendListID,
  }).select("id fullName avatar statusOnline");

  for (const user of infoUserFriends) {
    const infoFriend = friendList.find((friend) => friend.user_ID == user.id);
    console.log(infoFriend);
    user.infoFriend = infoFriend;
  }

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
