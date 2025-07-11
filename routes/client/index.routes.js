const productRouter = require("./product.routes");
const homeRouter = require("./home.routes");
module.exports = (app) => {
    app.use('/', homeRouter)
    app.use('/products', productRouter)

};
