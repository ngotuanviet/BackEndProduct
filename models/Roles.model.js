const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    permissions: {
      type: DataTypes.JSON, // Store as JSON
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue("permissions");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("permissions", JSON.stringify(value));
      },
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deleteBy_account_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
    createdBy_account_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updatedBy_account_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // Sequelize automatically adds createdAt and updatedAt
  },
  {
    tableName: "roles",
    timestamps: true,
    paranoid: false, // Set to true if you want soft deletes with `deletedAt`
  }
);

module.exports = Role;
