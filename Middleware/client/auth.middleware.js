const Users = require("../../models/Users.model");

const auth = async (req, res, next) => {
    if (req.cookies.tokenUser) {
        const user = await Users.findOne({
            token: req.cookies.tokenUser,
            deleted: false,
            status: 'active'
        }).select("-password")
        if (user) {
            res.locals.user = user
        }
    }
    next()
}
const requireAuth = async (req, res, next) => {
    try {

        if (!req.cookies.tokenUser) {
            res.redirect(`/user/login`);
        }
        const users = await Users.findOne({ token: req.cookies.tokenUser, deleted: false }).select("-password");
        if (!users) {
            res.redirect(`/user/login`);
        } else {
            res.locals.user = users;
            next()
        }
    } catch (error) {
        console.log(error);

        res.redirect(`/user/login`);
    }
}
module.exports = { auth, requireAuth };