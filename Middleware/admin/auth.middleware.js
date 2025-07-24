const SytemConfig = require("../../config/system");
const Accounts = require("../../models/Accounts.model");
const requireAuth = async (req, res, next) => {
    try {
        const users = await Accounts.findOne({ token: req.cookies.token, deleted: false });
        if (!req.cookies.token) {
            res.redirect(`${SytemConfig.prefixAdmin}/auth/login`);
        } else if (!users) {
            res.redirect(`${SytemConfig.prefixAdmin}/auth/login`);

        } else {
            next()
        }
    } catch (error) {
        console.log(error);

        res.redirect(`${SytemConfig.prefixAdmin}/auth/login`);
    }


}
module.exports = {
    requireAuth
}
