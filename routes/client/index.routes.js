const productRouter = require("./product.routes");
const homeRouter = require("./home.routes");
const categoriesMiddleware = require("../../Middleware/client/category.middleware");
const cartsMiddleware = require("../../Middleware/client/carts.middleware");
const cartRoute = require("./cart.routes");
const searchRouter = require("./search.routes");
const authRouter = require("./auth.routes");

const checkoutRouter = require("./checkout.routes");
module.exports = (app) => {
    app.use(categoriesMiddleware.categories)
    app.use(cartsMiddleware.CartID)
    app.use('/', homeRouter)
    app.use('/products', productRouter)
    app.use('/search', searchRouter)
    app.use('/cart', cartRoute)
    app.use('/checkout', checkoutRouter)
    app.use('/user', authRouter)
};
