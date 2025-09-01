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
    const role = new Role({
        ...req.body,
        createdBy: {
            account_id: res.locals.user.id, createdAt: Date.now()
        }
    });
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
    await Role.updateOne({ _id: req.params.id }, {
        ...req.body,
        $push: { updatedBy: { account_id: res.locals.user.id, updatedAt: Date.now() } }
    });
    res.redirect('/admin/roles');
}
const deleteRole = async (req, res) => {
    const role = await Role.updateOne(req.params.id, {
        deleted: true,
        deleteBy: { account_id: res.locals.user.id, deletedAt: Date.now() }
    });
    // if (!role) {
    //     return res.status(404).send('Role not found');
    // }
    // role.deleted = true;
    // role.deleteAt = new Date();
    // await role.save();
    res.redirect('/admin/roles');
}
const permissions = async (req, res) => {
    const find = {
        deleted: false,
    }

    const role = await Role.find(find).sort({ title: "desc" });
    res.render('admin/pages/roles/permissions', {
        title: 'Phân quyền',
        role: role,
    });
}
const permissionsUpdate = async (req, res) => {
    const permissions = JSON.parse(req.body.permissions);
    if (permissions.length > 0) {

        for (const item of permissions) {
            await Role.updateOne({ _id: item.id }, {
                permissions: item.permissions,
                $push: {
                    updatedBy: {
                        account_id: res.locals.user.id,
                        updatedAt: Date.now()
                    }
                }
            })
        }
        req.flash('success', 'Cập nhật quyền thành công');
        res.redirect('/admin/roles/permissions');

    } else {
        req.flash('error', 'Cập nhật quyền không thành công');
        res.redirect('/admin/roles/permissions');
    }
}
module.exports = {
    index,
    create,
    createPost, edit, editPost, deleteRole, permissions, permissionsUpdate

}