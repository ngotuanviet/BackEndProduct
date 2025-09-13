const SettingsGeneral = require("../../models/settings-general.model");

const SettingGenetal = async (req, res, next) => {
  const settingGeneral = await SettingsGeneral.findOne({});
  res.locals.settingGeneral = settingGeneral;

  next();
};
module.exports = {
  SettingGenetal,
};
