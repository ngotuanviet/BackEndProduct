const Product = require("../../models/Product.model")

// [Get] /admin/products
const index = async (req, res) => {
    const { status } = req.query;

    let filtersStatus = [
        {
            name: "Tất cả",
            status: "",
            class: "active",
        },
        {
            name: "Hoạt động",
            status: "active",
            class: "",
        },
        {
            name: "Không hoạt động",
            status: "inactive",
            class: ""
        }
    ]
    let find = {
        deleted: 'false',

    };
    if (status) {
        find.status = status
        filtersStatus.forEach(filter => {
            filter.class = filter.status === status ? "active" : ""
        })
    }


    const products = await Product.find(find)


    res.render('admin/pages/products/index', {
        title: "Trang quản lý sản phẩm",
        products,
        filtersStatus
    })
}
module.exports = {
    index
}