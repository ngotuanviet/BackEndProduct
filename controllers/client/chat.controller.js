
const Chats = require("../../models/Chats.model");
const Users = require("../../models/Users.model");
const chatSocket = require("../../sockets/client/chat.socket");

const index = async (req, res) => {

    chatSocket(res)
    // lấy data
    const chats = await Chats.find({ deleted: false })
    for (const chat of chats) {
        const infoUser = await Users.findOne({ _id: chat.user_id }).select("fullName")

        chat.fullName = infoUser.fullName
    }
    // end



    res.render('client/pages/chat/index', {
        title: "Chat",
        chats
    }
    )
}
module.exports = {
    index
}
