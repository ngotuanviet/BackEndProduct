const Role = require('../../models/Roles.model');
// [GET] /admin/roles
const index = async (req, res) => {
    const find = {
        deleted: false,
    }
    const roles = await Role.find(find);
    res.render('admin/pages/roles/index', {
        title: 'Quản lý nhóm quyền',
        roles
    });
}
const create = async (req, res) => {
    res.render('admin/pages/roles/create', {
        title: 'Tạo nhóm quyền',
    });
}
const createPost = async (req, res) => {
    // const { title, description, permissions } = req.body;
    // const role = new Role({
    //     title,
    //     description,
    //     permissions: permissions ? permissions.split(',') : [],
    // });
    const role = new Role(req.body);
    await role.save();
    res.redirect('/admin/roles');
}
const edit = async (req, res) => {
    const role = await Role.findById(req.params.id);
    if (!role) {
        return res.status(404).send('Role not found');
    }
    res.render('admin/pages/roles/edit', {
        title: 'Chỉnh sửa nhóm quyền',
        role
    });
}
const editPost = async (req, res) => {
    await Role.updateOne({ _id: req.params.id }, req.body);
    res.redirect('/admin/roles');
}
const deleteRole = async (req, res) => {
    const role = await Role.findById(req.params.id);
    if (!role) {
        return res.status(404).send('Role not found');
    }
    role.deleted = true;
    role.deleteAt = new Date();
    await role.save();
    res.redirect('/admin/roles');
}
module.exports = {
    index,
    create,
    createPost, edit, editPost, deleteRole

}