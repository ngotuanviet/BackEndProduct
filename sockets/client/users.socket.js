const e = require("express");
const Users = require("../../models/Users.model");
module.exports = (res) => {
  //SocketIO

  _io.once("connection", (socket) => {
    console.log(`a user connected, ${socket.id}`);
    // gửi yêu cầu
    socket.on("CLIENT_ADD-FRIEND", async (userID) => {
      try {
        const myUserID = res.locals.user.id;
        const exitsUserAinB = await Users.findOne({
          _id: userID,
          acceptFriends: myUserID,
        });
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
          await Users.updateOne(
            { _id: userID },
            {
              $push: { acceptFriends: myUserID },
            }
          );
        }
        const exitsUserBinA = await Users.findOne({
          _id: myUserID,
          requestFriends: userID,
        });
        if (!exitsUserBinA) {
          await Users.updateOne(
            { _id: myUserID },
            {
              $push: { requestFriends: userID },
            }
          );
        }
        // lấy ra độ dài của acceptFriends của B và trả về cho B
        const infoUserB = await Users.findOne({ _id: userID });
        const lengthAcceptFriends = infoUserB.acceptFriends.length;
        //socket.broadcast loại trừ người gửi tất cả đều nhận được
        socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", {
          userID: userID,
          lengthAcceptFriends,
        });
        // lấy info của A và trả về cho b
        const infoUserA = await Users.findOne({ _id: myUserID }).select(
          "id avatar fullName"
        );
        socket.broadcast.emit("SERVER_RETURN_INFO_USER_A", {
          userID,
          infoUserA,
        });
        // Gửi ID của người gửi (A) và người nhận (B) để xoá khỏi danh sách chưa kết bạn của B
        socket.broadcast.emit("SERVER_RETURN_USER_ID_ADD_FRIEND", {
          userIDA: myUserID,
          userIDB: userID,
        });
      } catch (error) {
        console.log(error);
      }
    });
    // huỷ gửi yêu cầu
    socket.on("CLIENT_CANCEL-FRIEND", async (userID) => {
      try {
        const myUserID = res.locals.user.id;
        const exitsUserAinB = await Users.findOne({
          _id: userID,
          acceptFriends: myUserID,
        });
        /* 
          huỷ xoá tất cả id đấy trong acceptFriends và requestFriends
                */
        if (exitsUserAinB) {
          await Users.updateOne(
            { _id: userID },
            {
              $pull: { acceptFriends: myUserID },
            }
          );
        }
        const exitsUserBinA = await Users.findOne({
          _id: myUserID,
          requestFriends: userID,
        });
        if (exitsUserBinA) {
          await Users.updateOne(
            { _id: myUserID },
            {
              $pull: { requestFriends: userID },
            }
          );
        }
        // lấy ra độ dài của acceptFriends của B và trả về cho B
        const infoUser = await Users.findOne({ _id: userID });
        const lengthAcceptFriends = infoUser.acceptFriends.length;
        //socket.broadcast loại trừ người gửi tất cả đều nhận được
        socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", {
          userID: userID,
          lengthAcceptFriends,
        });
        // lấy Id của A trả về cho B
        socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
          userIDB: userID,
          userIDA: myUserID,
        });
      } catch (error) {
        console.log(error);
      }
    });
    // từ chối kết bạn
    socket.on("CLIENT_REFUSE-FRIEND", async (userID) => {
      try {
        const myUserID = res.locals.user.id;
        console.log(userID);

        const exitsUserBinA = await Users.findOne({
          _id: myUserID,
          acceptFriends: userID,
        });
        /* 
                     huỷ xoá tất cả id đấy trong acceptFriends và requestFriends
                */
        if (exitsUserBinA) {
          // xoá id của A trong acceptFriends của B
          await Users.updateOne(
            { _id: myUserID },
            {
              $pull: { acceptFriends: userID },
            }
          );
        }
        const exitsUserAinB = await Users.findOne({
          _id: userID,
          requestFriends: myUserID,
        });
        if (exitsUserAinB) {
          // xoá id của B trong requestFriends của A
          await Users.updateOne(
            { _id: userID },
            {
              $pull: { requestFriends: myUserID },
            }
          );
        }
      } catch (error) {
        console.log(error);
      }
    });
    // đồng ý kết bạn
    socket.on("CLIENT_ACCEPT-FRIEND", async (userID) => {
      try {
        const myUserID = res.locals.user.id; //b
        userID; // a
        console.log(userID);

        const exitsUserBinA = await Users.findOne({
          _id: myUserID,
          acceptFriends: userID,
        });
        /* 
                    khi add friend thành công thì xoá id đấy trong acceptFriends và requestFriends
                */
        if (exitsUserBinA) {
          // xoá id của A trong acceptFriends của B
          await Users.updateOne(
            { _id: myUserID },
            {
              $push: {
                friendsList: {
                  user_ID: userID,
                  room_chat_id: "",
                },
              },
              $pull: { acceptFriends: userID },
            }
          );
        }
        const exitsUserAinB = await Users.findOne({
          _id: userID,
          requestFriends: myUserID,
        });
        if (exitsUserAinB) {
          // xoá id của B trong requestFriends của A
          await Users.updateOne(
            { _id: userID },
            {
              $push: {
                friendsList: {
                  user_ID: myUserID,
                  room_chat_id: "",
                },
              },
              $pull: { requestFriends: myUserID },
            }
          );
        }
        /* 
                    khi add friend thành công thì {user_id, room_chat_id} của A vào friendlist của B
                    khi add friend thành công thì {user_id, room_chat_id} của B vào friendlist của A
               */
      } catch (error) {
        console.log(error);
      }
    });
  });
  // end
};
