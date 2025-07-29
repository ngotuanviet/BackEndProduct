const Users = require("../../models/Users.model")

const validateRegister = async (req, res, next) => {

    const { fullName, email } = req.body
    if (!fullName) {
        req.flash("error", "Vui lòng nhập họ tên!")
        res.redirect("/user/register")
    } else if (!email) {
        req.flash("error", "Vui lòng nhập email!")
        res.redirect("/user/register")
    } else {
        req.flash("error", "Vui lòng nhập mật khẩu!")
        res.redirect("/user/register")
    }
    next()
}
module.exports = {
    validateRegister

}