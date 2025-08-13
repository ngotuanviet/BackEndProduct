const Users = require("../../models/Users.model");
const usersSocket = require("../../sockets/client/users.socket");
const notFriend = async (req, res) => {
    const userID = res.locals.user.id
    const userIDFriend = req.query.userID
    console.log(userIDFriend);
    usersSocket(res)
    const myUser = await Users.findOne({ _id: userID })
    const requestFriends = myUser.requestFriends
    const acceptFriends = myUser.acceptFriends

    const users = await Users.find({
        $and: [{
            _id: { $ne: userID },

        }, { _id: { $nin: requestFriends }, },
        { _id: { $nin: acceptFriends } }],
        deleted: false, status: 'active'
    }).select("fullName avatar")


    res.render("client/pages/users/not-friend", {
        title: "Danh sách người dùng",
        users
    })
}
const request = async (req, res) => {
    const myUserID = res.locals.user.id
    const myUser = await Users.findOne({ _id: myUserID })
    const requestFriends = myUser.requestFriends
    usersSocket(res)
    arrayInfoUser = [];
    for (const item of requestFriends) {
        const infoUserAddFriends = await Users.findOne({ _id: item }).select("fullName avatar")
        arrayInfoUser.push(infoUserAddFriends);
    }



    res.render("client/pages/users/request", {
        title: "Lời mời đã gửi",
        users: arrayInfoUser
    })
}
module.exports = {
    notFriend,
    request
}