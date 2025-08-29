const SytemConfig = require("../../config/system");
const Accounts = require("../../models/Accounts.model");
const Role = require("../../models/Roles.model");
const requireAuth = async (req, res, next) => {
  try {
    const users = await Accounts.findOne({
      token: req.cookies.token,
      deleted: false,
    }).select("-password");
    if (!req.cookies.token) {
      res.redirect(`${SytemConfig.prefixAdmin}/auth/login`);
    } else if (!users) {
      res.redirect(`${SytemConfig.prefixAdmin}/auth/login`);
    } else {
      const roles = await Role.findOne({
        _id: users.role_id,
        deleted: false,
      }).select("title permissions");
      res.locals.user = users;
      res.locals.rolesUser = roles;

      next();
    }
  } catch (error) {
    console.log(error);

    res.redirect(`${SytemConfig.prefixAdmin}/auth/login`);
  }
};
module.exports = {
  requireAuth,
};
