const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Product = require("./Product.model"); // Assuming Product model will also be converted to Sequelize

const Cart = sequelize.define(
  "Cart",
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
    // Sequelize automatically adds createdAt and updatedAt
  },
  {
    tableName: "carts",
    timestamps: true,
  }
);

const CartProduct = sequelize.define(
  "CartProduct",
  {
    cart_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Cart,
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Product, // This will be defined later
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "cart_products",
    timestamps: false, // Junction table typically doesn't need timestamps
  }
);

// Define associations
Cart.hasMany(CartProduct, { foreignKey: "cart_id", as: "products" });
CartProduct.belongsTo(Cart, { foreignKey: "cart_id" });
CartProduct.belongsTo(Product, { foreignKey: "product_id" }); // Assuming Product model will be defined

module.exports = { Cart, CartProduct };
