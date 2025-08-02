const SettingsGeneral = require("../../models/settings-general.model")

const SettingGenetal = async (req, res, next) => {
    const settingGenetal = await SettingsGeneral.findOne({})
    res.locals.settingGenetal = settingGenetal

    next()
}
module.exports = {
    SettingGenetal
}