const SettingsGeneral = require("../../models/settings-general.model");

const general = async (req, res) => {
  const settingsGeneral = await SettingsGeneral.findOne({});
  res.render("admin/pages/settings/general", {
    title: "Cài đặt chung",
    settingsGeneral,
  });
};
const generalPATCH = async (req, res) => {
  console.log(req.body);

  const settingsGeneral = await SettingsGeneral.findOne({});
  if (settingsGeneral) {
    await SettingsGeneral.updateOne({}, req.body);
    req.flash("success", "Cập nhật cài đặt thành công");
  } else {
    const record = new SettingsGeneral(req.body);
    await record.save();
    req.flash("success", "Tạo dữ liệu cài đặt thành công");
  }

  res.redirect("/admin/settings/general");
};
module.exports = {
  general,
  generalPATCH,
};
