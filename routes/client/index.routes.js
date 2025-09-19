const productRouter = require("./product.routes");
const homeRouter = require("./home.routes");
const categoriesMiddleware = require("../../Middleware/client/category.middleware");
const cartsMiddleware = require("../../Middleware/client/carts.middleware");
const cartRoute = require("./cart.routes");
const searchRouter = require("./search.routes");
const authRouter = require("./auth.routes");
const chatRouter = require("./chat.routes");
const authMiddleware = require("../../Middleware/client/auth.middleware");
const settingMiddleware = require("../../Middleware/client/settings.midlleware");
const checkoutMiddleware = require("../../Middleware/client/checkout.validates");
const usersRouter = require("./users.routes");
const ordersRouter = require("./orders.routes");
const checkoutRouter = require("./checkout.routes");
const postRouter = require("./posts.routes");
// const socketMiddleware = require("../../Middleware/client/socket.middleware"); // Removed: Socket.IO logic does not belong in Express middleware
const roomChatRouter = require("./room-chat.routes");
module.exports = (app) => {
  app.use(categoriesMiddleware.categories);
  app.use(cartsMiddleware.CartID);
  app.use(authMiddleware.auth);
  app.use(settingMiddleware.SettingGenetal);
  // app.use(socketMiddleware.connect); // Removed: Socket.IO logic does not belong in Express middleware

  app.use("/", homeRouter);
  app.use("/products", productRouter);
  app.use("/search", searchRouter);
  app.use("/cart", cartRoute);
  app.use("/checkout", checkoutRouter);
  app.use("/user", authRouter);
  app.use("/posts", postRouter);
  app.use("/chat", authMiddleware.requireAuth, chatRouter);
  app.use("/users", authMiddleware.requireAuth, usersRouter);
  app.use("/orders", authMiddleware.requireAuth, ordersRouter);
  app.use("/rooms-chat", authMiddleware.requireAuth, roomChatRouter);
};
