const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Chat = sequelize.define(
  "Chat",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
    },
    images: {
      type: DataTypes.JSON, // Store as JSON
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("images");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("images", JSON.stringify(value));
      },
    },
    avatar: {
      type: DataTypes.STRING,
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
    tableName: "chats",
    timestamps: true,
    paranoid: false, // Set to true if you want soft deletes with `deletedAt`
  }
);

module.exports = Chat;
