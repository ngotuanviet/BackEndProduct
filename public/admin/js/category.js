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
