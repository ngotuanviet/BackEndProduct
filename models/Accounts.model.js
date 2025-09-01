const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const generate = require("../helper/generate"); // Assuming generate.js is still needed for token generation

const Account = sequelize.define(
  "Account",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      defaultValue: () => generate.generateRandomString(100), // Use a function for default value
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    role_id: {
      type: DataTypes.INTEGER,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "active",
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deleteAt: {
      type: DataTypes.DATE,
    },
    // Sequelize automatically adds createdAt and updatedAt
  },
  {
    tableName: "accounts",
    timestamps: true,
    paranoid: false, // Set to true if you want soft deletes with `deletedAt`
    // If using `deletedAt` for soft deletes, Sequelize will manage it.
    // For now, keeping `deleted` and `deleteAt` manually managed as per original schema.
  }
);

// Synchronize the model with the database (create table if it doesn't exist)
// This should ideally be called once during application startup or migration.
// Account.sync({ alter: true }); // Use alter: true to make changes to existing tables

module.exports = Account;
