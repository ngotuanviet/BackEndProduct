const Users = require("../../models/Users.model");
module.exports = (res) => {
    //SocketIO



    _io.once('connection', (socket) => {
        console.log(`a user connected, ${socket.id}`);
        // gửi yêu cầu
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
        // huỷ gửi yêu cầu
        socket.on('CLIENT_CANCEL-FRIEND', async (userID) => {
            try {


                const myUserID = res.locals.user.id
                const exitsUserAinB = await Users.findOne({
                    _id: userID,
                    acceptFriends: myUserID
                })
                /* 
                     huỷ xoá tất cả id đấy trong acceptFriends và requestFriends
                */
                if (exitsUserAinB) {
                    await Users.updateOne({ _id: userID }, {
                        $pull: { acceptFriends: myUserID }

                    })
                }
                const exitsUserBinA = await Users.findOne({
                    _id: myUserID,
                    requestFriends: userID
                })
                if (exitsUserBinA) {
                    await Users.updateOne({ _id: myUserID }, {
                        $pull: { requestFriends: userID }

                    })
                }
            } catch (error) {
                console.log(error);

            }
        })
    });
    // end
}