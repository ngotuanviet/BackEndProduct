const Orders = require("../../models/Orders.model");
const Product = require("../../models/Product.model");

const index = async (req, res) => {
  const userID = res.locals.user.id;

  const orders = await Orders.find({
    user_id: userID,
    deleted: false,
  });
  const filtersStatus = [
    { status: "initial", name: "Chờ xác nhận" },
    { status: "paid", name: "Đã xác nhận" },
    { status: "shipping", name: "Đang giao" },
    { status: "delivered", name: "Hoàn thành" },
    { status: "cancelled", name: "Đã hủy" },
  ];

  for (const order of orders) {
    for (const product of order.products) {
      product.priceNew = product.price * (1 - product.discountPercentage / 100);
    }
  }
  for (let i = 0; i < orders.length; i++) {
    filtersStatus.forEach((item) => {
      if (orders[i].status === item.status) {
        orders[i].statusName = item.name;
      }
    });
  }

  res.render("client/pages/orders/index", {
    title: "Đơn hàng",
    orders,
    filtersStatus,
  });
};

const detail = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = res.locals.user.id;

    const order = await Orders.findOne({
      _id: orderId,
      user_id: userId,
      deleted: false,
    });

    if (!order) {
      return res.redirect("/orders");
    }

    for (const product of order.products) {
      const productInfo = await Product.findOne({ _id: product.product_id });
      if (productInfo) {
        product.title = productInfo.title;
        product.thumbnail = productInfo.thumbnail;
      }
      product.priceNew = product.price * (1 - product.discountPercentage / 100);
    }

    res.render("client/pages/orders/detail", {
      title: "Chi tiết đơn hàng",
      order: order,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/orders");
  }
};

module.exports = {
  index,
  detail,
};
