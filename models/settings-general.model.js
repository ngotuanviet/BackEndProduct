const { default: mongoose } = require("mongoose");

const SettingsGeneralSchema = new mongoose.Schema(
  {
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    copyright: String,
    slider1: String,
    slider2: String,
    slider3: String,
  },
  {
    timestamps: true,
  }
);
const SettingsGeneral = mongoose.model(
  "settings-general",
  SettingsGeneralSchema,
  "settings-general"
);
module.exports = SettingsGeneral;
