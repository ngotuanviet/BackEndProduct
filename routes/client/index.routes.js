const productRouter = require("./product.routes");
const homeRouter = require("./home.routes");
const categoriesMiddleware = require("../../Middleware/client/category.middleware");
module.exports = (app) => {
    app.use(categoriesMiddleware.categories)
    app.use('/', homeRouter)
    app.use('/products', productRouter)

};
