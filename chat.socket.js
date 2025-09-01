const uploadToCloudinary = require("../../helper/uploadCloudinary");
const Chats = require("../../models/Chats.model");
const Users = require("../../models/Users.model");

module.exports = (io) => {
  io.on("connection", async (socket) => {
    const myUserID = socket.handshake?.auth?.token || "";
    let myFullName = "";
    if (myUserID) {
      try {
        const me = await Users.findById(myUserID).select("fullName");
        myFullName = me?.fullName || "";
      } catch {}
    }

    // Client must join a room before sending/receiving events
    socket.on("CLIENT_JOIN_ROOM", (roomChatID) => {
      if (!roomChatID) return;
      socket.join(roomChatID);
      socket.data.roomChatID = roomChatID;
    });

    socket.on("CLIENT_SEND_MESSAGES", async (data) => {
      try {
        let roomChatID = socket.data.roomChatID;
        if (!roomChatID && data?.roomChatID) {
          socket.join(data.roomChatID);
          socket.data.roomChatID = data.roomChatID;
          roomChatID = data.roomChatID;
        }
        if (!roomChatID) return;

        const images = [];
        const incoming = Array.isArray(data?.images) ? data.images : [];
        for (const imageBuffer of incoming) {
          const link = await uploadToCloudinary(imageBuffer);
          images.push(link);
        }

        const chat = new Chats({
          user_id: myUserID,
          content: data.content || "",
          images: images,
          room_chat_id: roomChatID,
        });
        await chat.save();

        io.to(roomChatID).emit("SERVER_RETURN_MESSAGES", {
          userID: myUserID,
          fullName: myFullName,
          content: data.content,
          images: images,
        });
      } catch (error) {
        console.error("Error processing message:", error);
        socket.emit("SERVER_RETURN_ERROR", {
          message: "Error processing your message. Please try again.",
        });
      }
    });

    // Typing indicators
    socket.on("CLIENT_SEND_TYPING", async (type) => {
      const roomChatID = socket.data.roomChatID;
      if (!roomChatID) return;
      socket.to(roomChatID).emit("SERVER_RETURN_TYPING", {
        userID: myUserID,
        fullName: myFullName,
        type: type,
      });
    });
  });
};

