const Account = require("../../models/Accounts.model");
const md5 = require("md5");

const index = async (req, res) => {
  const user = await Account.findOne({
    where: { token: req.cookies.token, deleted: false },
  });
  if (req.cookies.token && user) {
    return res.redirect("/admin/dashboard");
  }
  res.render("admin/pages/auth/login", {
    title: "Đăng nhập",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const account = await Account.findOne({
    where: { email: email, deleted: false },
  });
  if (!account) {
    req.flash("error", "Tài khoản không tồn tại");
    return res.redirect("/admin/auth/login");
  }

  if (account.password !== md5(password)) {
    req.flash("error", "Mật khẩu không đúng");
    return res.redirect("/admin/auth/login");
  }
  if (account.status === "inactive") {
    req.flash("error", "Tài khoản đã bị khóa");
    return res.redirect("/admin/auth/login");
  }
  res.cookie("token", account.token);
  res.redirect("/admin/dashboard");
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.redirect("/admin/auth/login");
};

module.exports = {
  index,
  login,
  logout,
};
