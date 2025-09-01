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
const usersRouter = require("./users.routes");
const checkoutRouter = require("./checkout.routes");
module.exports = (app) => {
    app.use(categoriesMiddleware.categories)
    app.use(cartsMiddleware.CartID)
    app.use(authMiddleware.auth)
    app.use(settingMiddleware.SettingGenetal)
    app.use('/', homeRouter)
    app.use('/products', productRouter)
    app.use('/search', searchRouter)
    app.use('/cart', cartRoute)
    app.use('/checkout', checkoutRouter)
    app.use('/user', authRouter)
    app.use('/chat', authMiddleware.requireAuth, chatRouter)
    app.use("/users", authMiddleware.requireAuth, usersRouter)
};
