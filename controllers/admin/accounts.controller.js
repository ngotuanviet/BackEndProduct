const Accounts = require('../../models/Accounts.model');
const Role = require('../../models/Roles.model');
const md5 = require('md5');
const index = async (req, res) => {
    const find = {
        deleted: 'false'
    }

    const accounts = await Accounts.find(find).select("-password -token");
    console.log(accounts);

    for (const account of accounts) {
        const { title } = await Role.findOne({ _id: account.role_id, deleted: false });

        account.role_id = title;
    }



    res.render(`admin/pages/accounts/index`, {
        title: "Quản Lý Tài Khoản",
        accounts
    });
}
const create = async (req, res) => {
    const roles = await Role.find({ deleted: false });
    res.render(`admin/pages/accounts/create`, {
        title: "Tạo Tài Khoản Mới",
        roles
    });
}
const createPOST = async (req, res) => {
    const emailExits = await Accounts.findOne({ email: req.body.email, deleted: false });
    if (emailExits) {
        req.flash("error", "Email đã tồn tại!");
        return res.redirect('/admin/accounts/create');
    }
    req.body.password = md5(req.body.password);
    const account = new Accounts(req.body);
    await account.save();
    req.flash("success", "Tạo mới tài khoản thành công!");
    res.redirect('/admin/accounts');
}
const changeStatus = async (req, res) => {
    const { id, status } = req.params;
    console.log(`ID: ${id}, Status: ${status}`);

    await Accounts.updateOne({ _id: id }, { status: status });
    req.flash("success", "Cập nhật trạng thái thành công!");
    res.redirect("/admin/accounts");

}
const edit = async (req, res) => {
    const { id } = req.params;
    const find = {
        deleted: 'false',
        _id: id
    }
    const account = await Accounts.findOne(find);
    const roles = await Role.find({ deleted: false });
    res.render("admin/pages/accounts/edit", {
        title: "Sửa Tài Khoản",
        account,
        roles
    })
}
const editPatch = async (req, res) => {
    const { id } = req.params;
    const find = {
        deleted: 'false',
        _id: id
    }
    const emailExits = await Accounts.findOne({
        _id: { $ne: id }, email: req.body.email, deleted: false
    });
    if (emailExits) {
        req.flash("error", `Email ${req.body.email} đã tồn tại!`);
    } else {
        if (req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }
    }
    await Accounts.updateOne(find, req.body);
    req.flash("success", "Sửa Tài Khoản Thành Công!");
    res.redirect("/admin/accounts");

}
const deleteID = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    await Accounts.updateOne({ _id: id }, { deleted: true, deleteAt: Date.now() });
    req.flash("success", "Xoá Tài Khoản Thành Công!");
    res.redirect("/admin/accounts");

}

module.exports = {
    index,
    create,
    createPOST,
    changeStatus,
    edit,
    deleteID,
    editPatch
}
