const index = (req, res) => {
    res.render('admin/pages/products/index', {
        title: "Trang quản lý sản phẩm"
    })
}
module.exports = {
    index
}