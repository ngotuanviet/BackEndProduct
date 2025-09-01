const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const generate = require("../helper/generate"); // Assuming generate.js is still needed for token generation

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    token: {
      type: DataTypes.STRING,
      defaultValue: () => generate.generateRandomString(100), // Use a function for default value
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    avatar: {
      type: DataTypes.STRING,
    },
    requestFriends: {
      type: DataTypes.JSON, // Store as JSON array
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue("requestFriends");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("requestFriends", JSON.stringify(value));
      },
    },
    acceptFriends: {
      type: DataTypes.JSON, // Store as JSON array
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue("acceptFriends");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("acceptFriends", JSON.stringify(value));
      },
    },
    friendsList: {
      type: DataTypes.JSON, // Store as JSON array of objects
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue("friendsList");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("friendsList", JSON.stringify(value));
      },
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
    tableName: "users",
    timestamps: true,
    paranoid: false, // Set to true if you want soft deletes with `deletedAt`
  }
);

module.exports = User;
