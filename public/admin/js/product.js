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
            console.log(action);
            formChangeStatus.action = action;
            formChangeStatus.submit();

        })
    }
    )

}
