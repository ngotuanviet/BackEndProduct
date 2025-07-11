const dashboard = (req, res) => {
    res.render('admin/pages/dashboard/index', {
        title: "Trang tổng quan"
    })
}
module.exports = {
    dashboard
}