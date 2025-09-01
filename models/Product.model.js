const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const slugify = require("slugify");
const Category = require("./Category.model"); // Assuming Category model will also be converted to Sequelize

const Product = sequelize.define(
  "Product",
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
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Can be null if category is deleted
      references: {
        model: Category, // This will be defined later
        key: "id",
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discountPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    thumbnail: {
      type: DataTypes.STRING,
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
      allowNull: true, // Assuming it can be null
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
    tableName: "products",
    timestamps: true,
    paranoid: false, // Set to true if you want soft deletes with `deletedAt`
    hooks: {
      beforeValidate: (product, options) => {
        if (product.title && !product.slug) {
          product.slug = slugify(product.title, { lower: true, strict: true });
        }
      },
      beforeUpdate: (product, options) => {
        if (product.changed("title") && !product.slug) {
          product.slug = slugify(product.title, { lower: true, strict: true });
        }
      },
    },
  }
);

// Define association with Category (assuming Category model is also converted)
Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });
Category.hasMany(Product, { foreignKey: "category_id", as: "products" });

module.exports = Product;
