const CreatePost = (req, res, next) => {
    if (!req.body.fullName || !req.body.password || !req.body.role_id) {
        req.flash("error", "Vui lòng điền đầy đủ thông tin!");
        return res.redirect('/admin/accounts/create');
    }
    next();
}
module.exports = {
    CreatePost
}