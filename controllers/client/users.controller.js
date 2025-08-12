const Users = require("../../models/Users.model");

const notFriend = async (req, res) => {
    const userID = res.locals.user.id
    const users = await Users.find({ _id: { $ne: userID }, deleted: false, status: 'active' }).select("fullName avatar")

    console.log(users);

    res.render("client/pages/users/not-friend", {
        title: "Danh sách người dùng",
        users
    })
}
module.exports = {
    notFriend
}