const buttonDelete = document.querySelectorAll('[button-delete]');
console.log(buttonDelete);
if (buttonDelete.length > 0) {
    buttonDelete.forEach(btn => {
        btn.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xoá quyền này?");
            if (isConfirm) {
                const id = btn.getAttribute("data-id");
                const formDeleteRole = document.querySelector("#form-delete-role");
                const path = formDeleteRole.getAttribute("data-path");
                const action = `${path}/${id}?_method=DELETE`;
                formDeleteRole.action = action;
                formDeleteRole.submit();
            }
        });
    });
}
// permission
const tablePermission = document.querySelector('[table-permission]');
if (tablePermission) {
    const buttonSubmit = document.querySelector('[button-submit]');
    buttonSubmit.addEventListener("click", () => {
        let permissions = [];
        const rows = tablePermission.querySelectorAll('tr');
        rows.forEach(row => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll('input');
            if (name == "id") {
                inputs.forEach(input => {
                    const id = input.value
                    permissions.push({ id: id, permissions: [] });
                });
                console.log(permissions);
            } else {
                inputs.forEach((input, index) => {
                    console.log(index);
                    if (input.checked) {
                        const value = input.value;
                        permissions[index].permissions.push(name);
                    }
                });
            }
        });
        if (permissions.length > 0) {
            const formChangePermissions = document.querySelector("#form-change-permissions");
            const inputPermissions = formChangePermissions.querySelector("input[name='permissions']");
            inputPermissions.value = JSON.stringify(permissions);
            formChangePermissions.submit();
        } else {
            alert("Vui lòng chọn quyền");
        }

    });
}
// permissions default
const getDataDefault = document.querySelector('[data-role]');

if (getDataDefault) {
    const records = JSON.parse(getDataDefault.getAttribute('data-role'));
    const tablePermission = document.querySelector('[table-permission]');
    records.forEach((record, index) => {
        const permission = record.permissions || [];
        permission.forEach((perm) => {
            console.log(perm);
            console.log(index);
            const row = tablePermission.querySelector(`tr[data-name="${perm}"]`);
            const input = row.querySelectorAll(`input`)[index];
            input.checked = true;

        })
    });

}
// end permissions default
