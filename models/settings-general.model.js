const { default: mongoose } = require("mongoose");

const SettingsGeneralSchema = new mongoose.Schema({
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    copyright: String

}, {
    timestamps: true,
}
);
const SettingsGeneral = mongoose.model('settings-general', SettingsGeneralSchema, "settings-general")
module.exports = SettingsGeneral;