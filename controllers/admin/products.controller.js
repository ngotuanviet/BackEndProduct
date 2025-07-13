const Product = require("../../models/Product.model")
const filtersStatusHelper = require("../../helper/filtersStatus")
const searchHelper = require("../../helper/search")
const paginationHelper = require("../../helper/pagination")
// [Get] /admin/products
const index = async (req, res) => {
    const { status, keyword, page } = req.query;
    let find = {
        deleted: 'false',

    };



    // bộ lọc
    const filtersStatus = filtersStatusHelper(status, find)
    const keywordSearch = searchHelper(keyword)
    if (keywordSearch.keyword) {
        find.title = keywordSearch.regex
    }

    // pagination
    const countDocuments = await Product.countDocuments(find)
    let objectPanination = await paginationHelper({
        limitItems: 4,
        currentPage: 1,


    }, page, countDocuments)
    console.log(objectPanination);


    // if (page) {
    //     let pageInt = parseInt(page)
    //     if (isNaN(pageInt)) {
    //         objectPanination.currentPage = 1
    //     } else if (page < 1) {
    //         objectPanination.currentPage = 1
    //     } else {
    //         objectPanination.currentPage = pageInt
    //         // (trang hiện tại - 1) * Số lượng xuất hiện phần tử mỗi trang
    //         objectPanination.skip = (objectPanination.currentPage - 1) * objectPanination.limitItems
    //     }

    // }
    // const countDocuments = await Product.countDocuments(find)
    // const totalPages = Math.ceil(countDocuments / objectPanination.limitItems)
    // objectPanination.totalPages = totalPages
    // End pagination
    const products = await Product.find(find).limit(objectPanination.limitItems).skip(objectPanination.skip)


    res.render('admin/pages/products/index', {
        title: "Trang quản lý sản phẩm",
        products,
        filtersStatus,
        keyword: keywordSearch.keyword,
        objectPanination
    })
}
// [Get] /admin/products/change-status/:status/:id
const changeStatus = async (req, res) => {
    const { status, id } = req.params;
    await Product.updateOne({ _id: id }, { status: status })
    // back list product
    backURL = req.header('Referer') || '/admin/products';
    res.redirect(backURL)

}

module.exports = {
    index,
    changeStatus
}