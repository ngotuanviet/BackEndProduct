const Category = require("../../models/Category.model")
const Product = require("../../models/Product.model")
const Users = require("../../models/Users.model")
const Accounts = require("../../models/Accounts.model")
// [get] /admin/dashboard
const dashboard = async (req, res) => {
    const static = {
        categoryProduct: {
            total: 0,
            active: 0,
            inactive: 0
        },
        product: {
            total: 0,
            active: 0,
            inactive: 0
        },
        accountAdmin: {
            total: 0,
            active: 0,
            inactive: 0
        },
        accountClient: {
            total: 0,
            active: 0,
            inactive: 0
        },

    }

    static.categoryProduct.total = await Category.countDocuments({ deleted: 'false' })
    static.categoryProduct.active = await Category.countDocuments({ status: 'active', deleted: 'false' })
    static.categoryProduct.inactive = await Category.countDocuments({ status: 'inactive', deleted: 'false' })
    static.product.total = await Product.countDocuments({ deleted: 'false' })
    static.product.active = await Product.countDocuments({ status: 'active', deleted: 'false' })
    static.product.inactive = await Product.countDocuments({ status: 'inactive', deleted: 'false' })
    static.accountAdmin.total = await Accounts.countDocuments({ deleted: 'false' })
    static.accountAdmin.active = await Accounts.countDocuments({ status: 'active', deleted: 'false' })
    static.accountAdmin.inactive = await Accounts.countDocuments({ status: 'inactive', deleted: 'false' })
    static.accountClient.total = await Users.countDocuments({ deleted: 'false' })
    static.accountClient.active = await Users.countDocuments({ status: 'active', deleted: 'false' })
    static.accountClient.inactive = await Users.countDocuments({ status: 'inactive', deleted: 'false' })
    res.render('admin/pages/dashboard/index', {
        title: "Trang tổng quan",
        static
    })
}
module.exports = {
    dashboard

}