const Orders = require("../../models/Orders.model");
const paginationHelper = require("../../helper/pagination");
const Product = require("../../models/Product.model");
const moment = require("moment");
const systemConfig = require("../../config/system");

// [GET] /admin/orders
const index = async (req, res) => {
  const {
    page,
    status,
    keyword,
    time,
    startDate,
    endDate,
    minPrice,
    maxPrice,
  } = req.query;

  try {
    const find = {
      deleted: false,
    };

    if (status) {
      find.status = status;
    }

    if (keyword) {
      const regex = new RegExp(keyword, "i");
      find["$or"] = [
        { _id: keyword },
        { "userInfo.phone": regex },
        { "userInfo.fullName": regex },
      ];
    }

    if (time) {
      const today = moment().startOf("day");
      if (time === "today") {
        find.createdAt = { $gte: today.toDate() };
      } else if (time === "thisWeek") {
        const startOfWeek = moment().startOf("week");
        find.createdAt = { $gte: startOfWeek.toDate() };
      } else if (time === "thisMonth") {
        const startOfMonth = moment().startOf("month");
        find.createdAt = { $gte: startOfMonth.toDate() };
      }
    }

    if (startDate && endDate) {
      find.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const filtersStatus = [
      { status: "", name: "Tất cả" },
      { status: "initial", name: "Chờ xác nhận" },
      { status: "paid", name: "Đã xác nhận" },
      { status: "shipping", name: "Đang giao" },
      { status: "delivered", name: "Hoàn thành" },
      { status: "cancelled", name: "Đã hủy" },
    ];

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

    let orders = await Orders.find(find)
      .sort({ createdAt: "desc" })
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);

    for (const order of orders) {
      order.totalPrice = order.products.reduce(
        (sum, item) =>
          sum +
          item.price * item.quantity * (1 - item.discountPercentage / 100),
        0
      );

      if (order.status === "paid") {
        const sevenDaysAgo = moment().subtract(7, "days");
        if (moment(order.createdAt).isBefore(sevenDaysAgo)) {
          order.isOverdue = true;
        }
      }
    }

    if (minPrice || maxPrice) {
      orders = orders.filter((order) => {
        const price = order.totalPrice;
        const isMinOk = minPrice ? price >= parseFloat(minPrice) : true;
        const isMaxOk = maxPrice ? price <= parseFloat(maxPrice) : true;
        return isMinOk && isMaxOk;
      });
    }
    for (const order of orders) {
      filtersStatus.forEach((item) => {
        if (order.status === item.status) {
          order.statusName = item.name;
        }
      });
    }
    console.log(orders);

    res.render("admin/pages/orders/index", {
      title: "Quản lý đơn hàng",
      orders: orders,
      filtersStatus: filtersStatus,
      pagination: objectPagination,
      keyword,
      time,
      startDate,
      endDate,
      minPrice,
      maxPrice,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Có lỗi xảy ra, vui lòng thử lại!");
    res.redirect(`${systemConfig.prefixAdmin}/orders`);
  }
};

const detail = async (req, res) => {
  const { id } = req.params;
  const order = await Orders.findOne({ _id: id });

  for (const item of order.products) {
    const product = await Product.findOne({ _id: item.product_id }).select(
      "title thumbnail price discountPercentage"
    );

    item.title = product.title;
    item.thumbnail = product.thumbnail;
    item.price = product.price;
    item.discountPercentage = product.discountPercentage;
  }
  const totalPrice = order.products.reduce(
    (sum, item) =>
      sum + item.price * item.quantity * (1 - item.discountPercentage / 100),
    0
  );

  const statusOrder = {
    name: "",
    value: "",
  };
  switch (order.status) {
    case "initial":
      statusOrder.name = "Chờ xác nhận";
      statusOrder.value = "initial";
      break;
    case "paid":
      statusOrder.name = "Đã xác nhận";
      statusOrder.value = "paid";
      break;
    case "shipping":
      statusOrder.name = "Đang giao";
      statusOrder.value = "shipping";
      break;
    case "delivered":
      statusOrder.name = "Hoàn thành";
      statusOrder.value = "delivered";
      break;
    case "cancelled":
      statusOrder.name = "Đã hủy";
      statusOrder.value = "cancelled";
      break;
    default:
      break;
  }
  res.render("admin/pages/orders/detail", {
    title: "Chi tiết đơn hàng",
    order: order,
    statusOrder,
    totalPrice,
  });
};

const changeStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await Orders.updateOne(
      { _id: id },
      {
        status: status,
        $push: {
          statusHistory: {
            status: status,
            timestamp: new Date(),
          },
        },
      }
    );
    req.flash("success", "Cập nhật trạng thái đơn hàng thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/orders`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Có lỗi xảy ra, vui lòng thử lại!");
    res.redirect(`${systemConfig.prefixAdmin}/orders`);
  }
};

module.exports = {
  index,
  detail,
  changeStatus,
};
