const Users = require("../../models/Users.model");
const {
  handleConnect,
  handleDisconnect,
} = require("../../Middleware/client/socket.middleware");
const RoomChat = require("../../models/rooms-chat.model");

module.exports = (io) => {
  const usersOnline = {};
  io.on("connection", (socket) => {
    const myUserID = socket.handshake.auth.token;
    if (myUserID) {
      usersOnline[myUserID] = socket.id;
    }
    handleConnect(socket, myUserID);
    socket.on("disconnect", () => {
      handleDisconnect(socket);
      delete usersOnline[myUserID];
    });
    // gửi yêu cầu
    socket.on("CLIENT_ADD-FRIEND", async (userID) => {
      try {
        // Prevent user from adding themselves
        if (userID === myUserID) {
          console.log("User cannot send friend request to themselves.");
          return;
        }

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
              $addToSet: { acceptFriends: myUserID },
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
              $addToSet: { requestFriends: userID },
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
        const receiverSocketId = usersOnline[userID]; // Get receiver's socket ID
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("SERVER_RETURN_INFO_USER_A", {
            userID,
            infoUserA,
          });
        }
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

        // Emit event to update UI for the refuser (myUserID)
        socket.emit("SERVER_RETURN_USER_ID_REFUSE_FRIEND", {
          userID: userID, // The user who sent the request (A)
          myUserID: myUserID, // The user who refused (B)
        });

        // Update length of acceptFriends for myUserID (B)
        const infoUserB = await Users.findOne({ _id: myUserID });
        const lengthAcceptFriends = infoUserB.acceptFriends.length;
        socket.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", {
          userID: myUserID,
          lengthAcceptFriends,
        });
      } catch (error) {
        console.log(error);
      }
    });
    // đồng ý kết bạn
    socket.on("CLIENT_ACCEPT-FRIEND", async (userID) => {
      try {
        const senderID = userID; // a (sender)

        // Prevent user from accepting their own request (should be caught by CLIENT_ADD-FRIEND, but as a safeguard)
        if (senderID === myUserID) {
          console.log("User cannot accept their own friend request.");
          return;
        }

        // Find existing chat room or create a new one
        let roomChat = await RoomChat.findOne({
          typeRoom: "friend",
          "users.user_ID": { $all: [myUserID, senderID] },
        });

        if (!roomChat) {
          const dataRoom = {
            typeRoom: "friend",
            users: [
              {
                user_ID: myUserID,
                role: "superadmin",
              },
              {
                user_ID: senderID,
                role: "superadmin",
              },
            ],
          };
          roomChat = new RoomChat(dataRoom);
          await roomChat.save();
        }

        // Update for myUserID (the acceptor)
        await Users.updateOne(
          { _id: myUserID },
          {
            $addToSet: {
              friendsList: {
                user_ID: senderID,
                room_chat_id: roomChat.id,
              },
            },
            $pull: { acceptFriends: senderID },
          }
        );

        // Update for senderID (the sender)
        await Users.updateOne(
          { _id: senderID },
          {
            $addToSet: {
              friendsList: {
                user_ID: myUserID,
                room_chat_id: roomChat.id,
              },
            },
            $pull: { requestFriends: myUserID },
          }
        );

        // Emit event to update UI for the acceptor (myUserID)
        socket.emit("SERVER_RETURN_USER_ID_ACCEPT_FRIEND", {
          userID: userID, // The user who sent the request (A)
          myUserID: myUserID, // The user who accepted (B)
        });

        // Update length of acceptFriends for myUserID (B)
        const infoUserB = await Users.findOne({ _id: myUserID });
        const lengthAcceptFriends = infoUserB.acceptFriends.length;
        socket.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", {
          userID: myUserID,
          lengthAcceptFriends,
        });
      } catch (error) {
        console.log(error);
      }
    });
  });
};
