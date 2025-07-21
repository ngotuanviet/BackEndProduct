const dashboardRouter = require("./dashboard.routes");
const productsRouter = require("./products.routes");
const categoriesRouter = require("./categories.routes");
const systemConfig = require("../../config/system");
const rolesRouter = require("./roles.routes");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin

    app.use(`${PATH_ADMIN}/dashboard`, dashboardRouter)
    app.use(`${PATH_ADMIN}/products`, productsRouter)
    app.use(`${PATH_ADMIN}/categories`, categoriesRouter)
    app.use(`${PATH_ADMIN}/roles`, rolesRouter);
};
