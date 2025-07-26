const index = (req, res) => {
    res.render('admin/pages/posts/index', {
        title: "Trang quản lý bài viết"
    })
}
module.exports = {
    index
};