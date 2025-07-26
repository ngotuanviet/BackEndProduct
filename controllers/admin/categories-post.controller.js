const index = (req, res) => {
    res.render('admin/pages/categories-posts/index', {
        title: "Trang quản lý danh mục bài viết"
    })
}
module.exports = {
    index
}