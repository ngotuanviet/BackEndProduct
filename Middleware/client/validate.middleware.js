const Users = require("../../models/Users.model")

const validateRegister = async (req, res, next) => {

    const { fullName, email, password } = req.body
    if (!fullName) {
        req.flash("error", "Vui lòng nhập họ tên!")
        res.redirect("/user/register")
    } else if (!email) {
        req.flash("error", "Vui lòng nhập email!")
        res.redirect("/user/register")
    } else if (!password) {
        req.flash("error", "Vui lòng nhập mật khẩu!")
        res.redirect("/user/register")
    }
    next()
}
const validateLogin = async (req, res, next) => {

    const { email, password } = req.body

    if (!email) {
        req.flash("error", "Vui lòng nhập email!")
        res.redirect("/user/register")
    } else if (!password) {
        req.flash("error", "Vui lòng nhập mật khẩu!")
        res.redirect("/user/register")
    }
    next()
}
const validateFogotPassword = async (req, res, next) => {

    const { email, password } = req.body

    if (!email) {
        req.flash("error", "Vui lòng nhập email!")
        res.redirect("/user/register")
    }
    next()
}
const validateResetPasword = async (req, res, next) => {
    const { password, passwordConfirm } = req.body
    if (!password) {
        req.flash("error", "Vui lòng nhập mật khẩu!")
        res.redirect("/user/reset")
    }
    if (!passwordConfirm) {
        req.flash("error", "Vui lòng nhập lại mật khẩu!")
        res.redirect("/user/reset")
    }
    if (password === passwordConfirm) {
        next()
    } else {
        req.flash("error", "Mật khẩu không khớp!")
        res.redirect("/user/reset")
    }

}
module.exports = {
    validateRegister, validateResetPasword,
    validateLogin,
    validateFogotPassword
}