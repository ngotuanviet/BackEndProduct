const Users = require("../../models/Users.model");
module.exports = (res) => {
    //SocketIO



    _io.once('connection', (socket) => {
        console.log(`a user connected, ${socket.id}`);
        socket.on('CLIENT_ADD-FRIEND', async (userID) => {
            try {
                const myUserID = res.locals.user.id
                const exitsUserAinB = await Users.findOne({
                    _id: userID,
                    acceptFriends: myUserID
                })
                /* 
                     khi A gửi kết bạnn cho b thì:
                     userID là B
                     myUserID là A
                     check B phần acceptFriends có tồn tại ID của A chưa nếu chưa sẽ
                        B sẽ lưu ID của A vào phần acceptFriends
                    check A phần requestFriends có tồn tại ID của B chưa nếu chưa sẽ
                        A sẽ lưu ID của B vào phần requestFriends
                */
                if (!exitsUserAinB) {
                    await Users.updateOne({ _id: userID }, {
                        $push: { acceptFriends: myUserID }

                    })
                }
                const exitsUserBinA = await Users.findOne({
                    _id: myUserID,
                    requestFriends: userID
                })
                if (!exitsUserBinA) {
                    await Users.updateOne({ _id: myUserID }, {
                        $push: { requestFriends: userID }

                    })
                }
            } catch (error) {

            }
        })
    });
    // end
}