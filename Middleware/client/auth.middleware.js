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
module.exports = { auth };