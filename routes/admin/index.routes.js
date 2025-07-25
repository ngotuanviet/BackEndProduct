const dashboardRouter = require("./dashboard.routes");
const productsRouter = require("./products.routes");
const authRouter = require("./auth.routes");
const authMiddleware = require("../../Middleware/admin/auth.middleware")
const categoriesRouter = require("./categories.routes");
const systemConfig = require("../../config/system");
const rolesRouter = require("./roles.routes");
const accountsRouter = require("./accounts.route");
const myAccountRouter = require("./myAccount.route");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin

    app.use(`${PATH_ADMIN}/dashboard`,
        authMiddleware.requireAuth,
        dashboardRouter)
    app.use(`${PATH_ADMIN}/products`, authMiddleware.requireAuth, productsRouter)
    app.use(`${PATH_ADMIN}/categories`, authMiddleware.requireAuth, categoriesRouter)
    app.use(`${PATH_ADMIN}/roles`, authMiddleware.requireAuth, rolesRouter);
    app.use(`${PATH_ADMIN}/accounts`, authMiddleware.requireAuth, accountsRouter);
    app.use(`${PATH_ADMIN}/auth`, authRouter)
    app.use(`${PATH_ADMIN}/my-account`, authMiddleware.requireAuth, myAccountRouter)
    // coming soon
    // app.use(`${PATH_ADMIN}/posts`, postsRouter)
};
