const Account = require("../../models/Accounts.model");
const Role = require("../../models/Roles.model");
const md5 = require("md5");
const { Op } = require("sequelize"); // Import Op for operators

const index = async (req, res) => {
  const find = {
    deleted: false,
  };

  const accounts = await Account.findAll({
    where: find,
    attributes: { exclude: ["password", "token"] },
  });

  for (const account of accounts) {
    const role = await Role.findOne({
      where: { id: account.role_id, deleted: false },
    });
    if (role) {
      account.role_id = role.title;
    } else {
      account.role_id = "N/A"; // Handle case where role might not be found
    }
  }

  res.render(`admin/pages/accounts/index`, {
    title: "Quản Lý Tài Khoản",
    accounts,
  });
};

const create = async (req, res) => {
  const roles = await Role.findAll({ where: { deleted: false } });
  res.render(`admin/pages/accounts/create`, {
    title: "Tạo Tài Khoản Mới",
    roles,
  });
};

const createPOST = async (req, res) => {
  const emailExits = await Account.findOne({
    where: { email: req.body.email, deleted: false },
  });
  if (emailExits) {
    req.flash("error", "Email đã tồn tại!");
    return res.redirect("/admin/accounts/create");
  }
  if (!req.body.avatar) {
    req.body.avatar = "";
  }
  req.body.password = md5(req.body.password);
  await Account.create(req.body);
  req.flash("success", "Tạo mới tài khoản thành công!");
  res.redirect("/admin/accounts");
};

const changeStatus = async (req, res) => {
  const { id, status } = req.params;
  console.log(`ID: ${id}, Status: ${status}`);

  await Account.update({ status: status }, { where: { id: id } });
  req.flash("success", "Cập nhật trạng thái thành công!");
  res.redirect("/admin/accounts");
};

const edit = async (req, res) => {
  const { id } = req.params;
  const find = {
    deleted: false,
    id: id,
  };
  const account = await Account.findOne({ where: find });
  const roles = await Role.findAll({ where: { deleted: false } });
  res.render("admin/pages/accounts/edit", {
    title: "Sửa Tài Khoản",
    account,
    roles,
  });
};

const editPatch = async (req, res) => {
  const { id } = req.params;
  const find = {
    deleted: false,
    id: id,
  };
  const emailExits = await Account.findOne({
    where: {
      id: { [Op.ne]: id },
      email: req.body.email,
      deleted: false,
    },
  });
  if (emailExits) {
    req.flash("error", `Email ${req.body.email} đã tồn tại!`);
    return res.redirect("back"); // Redirect back if email exists
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
  }
  if (!req.body.avatar) {
    req.body.avatar = "";
  }

  await Account.update(req.body, { where: find });
  req.flash("success", "Sửa Tài Khoản Thành Công!");
  res.redirect("/admin/accounts");
};

const deleteID = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  await Account.update(
    { deleted: true, deleteAt: new Date() },
    { where: { id: id } }
  );
  req.flash("success", "Xoá Tài Khoản Thành Công!");
  res.redirect("/admin/accounts");
};

module.exports = {
  index,
  create,
  createPOST,
  changeStatus,
  edit,
  deleteID,
  editPatch,
};
