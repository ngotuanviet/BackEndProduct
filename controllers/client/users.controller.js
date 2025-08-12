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
module.exports = {
    notFriend
}