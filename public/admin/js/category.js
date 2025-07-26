const changeStatus = document.querySelectorAll("[button-change-status]")
if (changeStatus.length > 0) {
    changeStatus.forEach(btn => {
        btn.addEventListener("click", () => {
            const formChangeStatus = document.querySelector("#form-change-status")
            const path = formChangeStatus.getAttribute("data-path")
            const statusCurrent = btn.getAttribute("data-status");
            const id = btn.getAttribute("data-id");

            let statusChange = statusCurrent === "active" ? "inactive" : "active";
            const action = `${path}/${statusChange}/${id}?_method=PATCH`
            formChangeStatus.action = action;
            formChangeStatus.submit();

        })
    })
}

console.log(changeStatus);
const btnDelete = document.querySelectorAll('[button-delete]');
if (btnDelete) {
    btnDelete.forEach(btn => {
        btn.addEventListener("click", () => {
            let id = btn.getAttribute("data-id")
            console.log(id);
            const formDelete = document.querySelector("#form-delete")
            const path = formDelete.getAttribute("data-path")
            const action = `${path}/${id}?_method=DELETE`
            formDelete.action = action;
            formDelete.submit();
        })
    })

}