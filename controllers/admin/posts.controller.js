const index = (req, res) => {
    res.render('admin/pages/posts/index', {
        title: "Trang quản lý bài viết"
    })
}
const create = (req, res) => {
    res.render('admin/pages/posts/create', {
        title: "Thêm bài viết"
    })
}
const createPost = (req, res) => {

}
module.exports = {
    index, create, createPost

};