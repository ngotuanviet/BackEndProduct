const index = (req, res) => {
    res.render('client/pages/chat/index', {
        title: "Chat"
    }
    )
}
module.exports = {
    index
}