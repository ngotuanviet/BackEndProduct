const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Product = require("./Product.model"); // Assuming Product model is converted

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    userInfo_fullName: {
      type: DataTypes.STRING,
    },
    userInfo_email: {
      type: DataTypes.STRING,
    },
    userInfo_phone: {
      type: DataTypes.STRING(20),
    },
    userInfo_address: {
      type: DataTypes.STRING,
    },
    userInfo_note: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "initial",
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
    // Sequelize automatically adds createdAt and updatedAt
  },
  {
    tableName: "orders",
    timestamps: true,
    paranoid: false, // Set to true if you want soft deletes with `deletedAt`
  }
);

const OrderProduct = sequelize.define(
  "OrderProduct",
  {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Order,
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Product,
        key: "id",
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
    },
    discountPercentage: {
      type: DataTypes.DECIMAL(5, 2),
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "order_products",
    timestamps: false,
  }
);

// Define associations
Order.hasMany(OrderProduct, { foreignKey: "order_id", as: "products" });
OrderProduct.belongsTo(Order, { foreignKey: "order_id" });
OrderProduct.belongsTo(Product, { foreignKey: "product_id" });

module.exports = { Order, OrderProduct };
