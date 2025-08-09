const Chats = require("../../models/Chats.model");
const Users = require("../../models/Users.model");
const index = async (req, res) => {
    const userID = res.locals.user.id
    const fullName = res.locals.user.fullName
    //SocketIO
    _io.once('connection', (socket) => {
        console.log(`a user connected, ${socket.id}`);
        socket.on('CLIENT_SEND_MESSAGES', async (content) => {
            const chat = new Chats({
                user_id: userID,
                content: content,
            })
            await chat.save()
            // trả data
            _io.emit('SERVER_RETURN_MESSAGES', {
                userID: userID,
                fullName: fullName,
                content: content
            })

        });
        // Typing
        socket.on('CLIENT_SEND_TYPING', async (type) => {
            socket.broadcast.emit('SERVER_RETURN_TYPING', {
                userID: userID,
                fullName: fullName,

                type: type
            })
        });
        // End Typing
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
    // end
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