const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const slugify = require("slugify");

const CategoryPost = sequelize.define(
  "CategoryPost",
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
      allowNull: true,
      defaultValue: null,
    },
    body: {
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
    tableName: "categories_posts",
    timestamps: true,
    paranoid: false, // Set to true if you want soft deletes with `deletedAt`
    hooks: {
      beforeValidate: (categoryPost, options) => {
        if (categoryPost.title && !categoryPost.slug) {
          categoryPost.slug = slugify(categoryPost.title, {
            lower: true,
            strict: true,
          });
        }
      },
      beforeUpdate: (categoryPost, options) => {
        if (categoryPost.changed("title") && !categoryPost.slug) {
          categoryPost.slug = slugify(categoryPost.title, {
            lower: true,
            strict: true,
          });
        }
      },
    },
  }
);

module.exports = CategoryPost;
