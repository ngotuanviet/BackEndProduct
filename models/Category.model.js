const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const slugify = require("slugify");

const Category = sequelize.define(
  "Category",
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
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Can be null for top-level categories
    },
    description: {
      type: DataTypes.TEXT,
    },
    thumbnail: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "active",
    },
    position: {
      type: DataTypes.INTEGER,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdBy_account_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updatedBy_account_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    deleteBy_account_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    deleteAt: {
      type: DataTypes.DATE,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    // Sequelize automatically adds createdAt and updatedAt
  },
  {
    tableName: "categories",
    timestamps: true,
    paranoid: false, // Set to true if you want soft deletes with `deletedAt`
    hooks: {
      beforeValidate: (category, options) => {
        if (category.title && !category.slug) {
          category.slug = slugify(category.title, {
            lower: true,
            strict: true,
          });
        }
      },
      beforeUpdate: (category, options) => {
        if (category.changed("title") && !category.slug) {
          category.slug = slugify(category.title, {
            lower: true,
            strict: true,
          });
        }
      },
    },
  }
);

module.exports = Category;
