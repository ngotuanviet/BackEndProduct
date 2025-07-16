// change status
const buttonChangeStatus = document.querySelectorAll('[button-change-status]');
console.log(buttonChangeStatus);

if (buttonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status")


    const path = formChangeStatus.getAttribute("data-path")

    buttonChangeStatus.forEach(btn => {
        btn.addEventListener("click", () => {
            const statusCurrent = btn.getAttribute("data-status");
            const id = btn.getAttribute("data-id");

            let statusChange = statusCurrent === "active" ? "inactive" : "active";

            const action = `${path}/${statusChange}/${id}?_method=PATCH`

            formChangeStatus.action = action;
            formChangeStatus.submit();

        })
    }
    )

}
// delete product
const ButtonsDelete = document.querySelectorAll('[button-delete]');
console.log(ButtonsDelete);

if (ButtonsDelete.length > 0) {
    const formChangeItem = document.querySelector("#form-delete-item")
    console.log(formChangeItem);

    const path = formChangeItem.getAttribute("data-path")



    ButtonsDelete.forEach(btn => {
        btn.addEventListener("click", () => {
            const isCorfirm = confirm("Bạn có chắc muốn xoá sản phẩm này?");
            if (isCorfirm) {
                const id = btn.getAttribute("data-id");
                console.log(id);
                const action = `${path}/${id}?_method=DELETE`
                console.log(action);

                formChangeItem.action = action;
                formChangeItem.submit();

            }
        })
    })
}


