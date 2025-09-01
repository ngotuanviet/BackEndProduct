const uploadToCloudinary = require("../../helper/uploadCloudinary")
const Chats = require("../../models/Chats.model");
module.exports = (res) => {
    //SocketIO
    const userID = res.locals.user.id
    const fullName = res.locals.user.fullName
    _io.once('connection', (socket) => {
        console.log(`a user connected, ${socket.id}`);
        socket.on('CLIENT_SEND_MESSAGES', async (data) => {
            try {
                const images = [];
                for (const imageBuffer of data.images) {
                    const link = await uploadToCloudinary(imageBuffer);
                    images.push(link);
                }

                const chat = new Chats({
                    user_id: userID,
                    content: data.content,
                    images: images,
                });
                await chat.save();

                _io.emit('SERVER_RETURN_MESSAGES', {
                    userID: userID,
                    fullName: fullName,
                    content: data.content,
                    images: images,
                });
            } catch (error) {
                console.error("Error processing message:", error);
                socket.emit("SERVER_RETURN_ERROR", { message: "Error processing your message. Please try again." });
            }
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
}