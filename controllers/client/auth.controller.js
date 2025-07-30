const md5 = require("md5")
const Users = require("../../models/Users.model")
const generate = require("../../helper/generate")

const forgotPassword = require("../../models/forgotPassword.model")
const register = (req, res) => {
    res.render("client/pages/auth/register", {
        title: "Đăng ký",
    })
}
const registerPOST = async (req, res) => {
    const exitsEmail = await Users.findOne({ email: req.body.email })
    if (exitsEmail) {
        req.flash("error", "Email đã tồn tại, vui lòng dùng tài khoản khác!")
        res.redirect("/user/register")
    }
    req.body.password = md5(req.body.password)
    const user = await Users(req.body)
    await user.save()
    req.flash("success", "Đăng ký thành công")
    res.cookie("tokenUser", user.token)
    res.redirect("/")
}
const login = (req, res) => {
    res.render("client/pages/auth/login", {
        title: "Đăng nhập",

    })
}
const loginPost = async (req, res) => {
    const { email, password } = req.body
    const user = await Users.findOne({
        email,
        deleted: false,
        status: 'active'
    })
    if (user) {
        if (user.password === md5(password)) {
            req.flash("success", "Đăng nhập thành công")
            res.cookie("tokenUser", user.token)
            res.redirect("/")
        }
        else {
            req.flash("error", "Mật khẩu không đúng")
            res.redirect("/user/login")
        }
    } else {
        req.flash("error", "Email không tồn tại")
        res.redirect("/user/login")
    }
    if (user.status === "inactive") {
        req.flash("error", "Tài khoản đang bị khóa")
        res.redirect("/user/login")
    }
}
const logOut = (req, res) => {
    res.clearCookie("tokenUser")
    res.redirect("/")
}
const forgotPasswordGet = (req, res) => {
    res.render("client/pages/auth/forgotPassword", {
        title: "Quên mật khẩu"
    })
}
const forgotPasswordPost = async (req, res) => {
    const { email } = req.body

    const user = await Users.findOne({ email, deleted: false, status: 'active' })
    if (!user) {
        req.flash("error", "Email không tồn tại")
        res.redirect("/user/password/forgot")
    } else {
        // lưu thông tin vào database
        const objectForgotPassword = {
            email: email,
            otp: generate.generateRandomNumber(6),
            expireAt: Date.now()
        }

        const forgot = new forgotPassword(objectForgotPassword)
        await forgot.save()
        // gửi email
    }

    // gửi otp email

}

module.exports = {
    register,
    registerPOST,
    login,
    loginPost,
    logOut,
    forgotPasswordGet,
    forgotPasswordPost
}   