const Orders = require("../../models/Orders.model");
const paginationHelper = require("../../helper/pagination");

// [GET] /admin/orders
const index = async (req, res) => {
  const { page } = req.query;

  try {
    const find = {
      deleted: false,
    };

    const count = await Orders.countDocuments(find);
    const objectPagination = await paginationHelper(
      {
        currentPage: 1,
        limitItems: 5,
        skip: 0,
      },
      page,
      count
    );

    const orders = await Orders.find(find)
      .sort({ createdAt: "desc" })
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);
    console.log(objectPagination.limitItems);

    for (const order of orders) {
      order.totalPrice = order.products.reduce(
        (sum, item) =>
          sum +
          item.price * item.quantity * (1 - item.discountPercentage / 100),
        0
      );
    }

    res.render("admin/pages/orders/index", {
      title: "Quản lý đơn hàng",
      orders: orders,
      pagination: objectPagination,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Có lỗi xảy ra, vui lòng thử lại!");
    res.redirect("back");
  }
};

module.exports = {
  index,
};
