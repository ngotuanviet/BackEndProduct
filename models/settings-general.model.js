const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const SettingsGeneral = sequelize.define(
  "SettingsGeneral",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    websiteName: {
      type: DataTypes.STRING,
    },
    logo: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    email: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    copyright: {
      type: DataTypes.STRING,
    },
    // Sequelize automatically adds createdAt and updatedAt
  },
  {
    tableName: "settings_general",
    timestamps: true,
    paranoid: false, // Not using soft deletes for this model
  }
);

module.exports = SettingsGeneral;
