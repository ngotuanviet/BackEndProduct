const index = (req, res) => {
    res.render('client/pages/products/index', {
        title: "Sản phẩm"
    })
}
module.exports = {
    index
}