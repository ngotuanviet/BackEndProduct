const index = (req, res) => {
    res.render('client/pages/home/index', {
        title: "Trang chủ"
    })
}
module.exports = {
    index
}