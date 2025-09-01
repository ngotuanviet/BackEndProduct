const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const slugify = require("slugify");
const CategoryPost = require("./Category_posts.model"); // Assuming CategoryPost model is converted

const Post = sequelize.define(
  "Post",
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
    category_post_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: CategoryPost,
        key: "id",
      },
    },
    body: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "active",
    },
    featured: {
      type: DataTypes.STRING,
    },
    position: {
      type: DataTypes.INTEGER,
    },
    createdBy_account_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    updatedBy_account_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    // Sequelize automatically adds createdAt and updatedAt
  },
  {
    tableName: "posts",
    timestamps: true,
    paranoid: false, // Set to true if you want soft deletes with `deletedAt`
    hooks: {
      beforeValidate: (post, options) => {
        if (post.title && !post.slug) {
          post.slug = slugify(post.title, { lower: true, strict: true });
        }
      },
      beforeUpdate: (post, options) => {
        if (post.changed("title") && !post.slug) {
          post.slug = slugify(post.title, { lower: true, strict: true });
        }
      },
    },
  }
);

// Define association with CategoryPost
Post.belongsTo(CategoryPost, {
  foreignKey: "category_post_id",
  as: "categoryPost",
});
CategoryPost.hasMany(Post, { foreignKey: "category_post_id", as: "posts" });

module.exports = Post;
