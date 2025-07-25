
// [GET] /
const index = async (req, res) => {
    res.render('client/pages/home/index', {
        title: "Trang chủ",
        LayoutProductsCategory: res.locals.Categories
    })
}
module.exports = {
    index
}