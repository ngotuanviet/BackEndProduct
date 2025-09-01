const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ForgotPassword = sequelize.define(
  "ForgotPassword",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // Sequelize automatically adds createdAt and updatedAt
  },
  {
    tableName: "forgot_password",
    timestamps: true,
    paranoid: false, // Not using soft deletes for this model
  }
);

module.exports = ForgotPassword;
