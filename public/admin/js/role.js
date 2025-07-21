
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