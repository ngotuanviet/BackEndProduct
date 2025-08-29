const Users = require("../../models/Users.model");

const handleConnect = (socket, myUserID) => {
  socket.myUserID = myUserID; // Store userID on the socket object

  console.log(`a user connected, ${socket.id} (User ID: ${myUserID})`);

  // Update user status to online in DB
  Users.updateOne({ _id: myUserID }, { statusOnline: "online" })
    .then(() => {
      // Emit status to all clients (except sender)
      socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
        userID: myUserID,
        status: "online",
      });
    })
    .catch((error) => console.error("Error updating online status:", error));
};

const handleDisconnect = async (socket) => {
  console.log(`User disconnected: ${socket.myUserID}`);
  // Update user status to offline in DB
  await Users.updateOne({ _id: socket.myUserID }, { statusOnline: "offline" })
    .then(() => {
      // Emit status to all clients (except sender)
      socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
        userID: socket.myUserID,
        status: "offline",
      });
    })
    .catch((error) => console.error("Error updating offline status:", error));
};

module.exports = {
  handleConnect,
  handleDisconnect,
};
