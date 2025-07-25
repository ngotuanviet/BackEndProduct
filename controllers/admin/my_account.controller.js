const md5 = require("md5");
const Accounts = require("../../models/Accounts.model");
const Role = require("../../models/Roles.model");

// [GET] admin/my-account
const infoAcccount = async (req, res) => {
    const { title } = await Role.findOne({ _id: res.locals.user.role_id, deleted: false });
    res.locals.user.role_id = title;
    res.render("admin/pages/my_account/info", {
        title: "Thông tin tài khoản"
    })
}
// [GET] admin/my-account/edit
const editAccount = async (req, res) => {
    const { title } = await Role.findOne({ _id: res.locals.user.role_id, deleted: false });
    res.locals.user.role_id = title;
    res.render("admin/pages/my_account/edit", {
        title: "Chỉnh sửa tài khoản"
    })
}
// [PATCH] admin/my-account/edit
const editAccountPATCH = async (req, res) => {
    const { id } = res.locals.user;
    if (req.body.password === "") {
        delete req.body.password;
    } else {
        req.body.password = md5(req.body.password);
    }
    await Accounts.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật tài khoản thành công!");
    res.redirect("/admin/my-account");
}
module.exports = {
    infoAcccount,
    editAccount,
    editAccountPATCH
}