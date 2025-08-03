const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        if (keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    });
    const clearButton = document.querySelector("[button-clear]");
    if (clearButton) {
        clearButton.addEventListener("click", () => {
            url.searchParams.delete("keyword");
            window.location.href = url.href;
        });
    }
}

const btnChangeStatus = document.querySelectorAll('[button-change-status]');

if (btnChangeStatus) {
    btnChangeStatus.forEach(btn => {
        btn.addEventListener("click", () => {
            const status = btn.getAttribute("data-status")

            const id = btn.getAttribute("data-id");

            const formChangeStatus = document.querySelector("[form-change-Status]")
            console.log(formChangeStatus);

            const path = formChangeStatus.getAttribute("path")
            console.log(path);
            const StatusNew = status === "active" ? "inactive" : "active"
            const action = `${path}/${StatusNew}/${id}?_method=PATCH`
            formChangeStatus.action = action;
            formChangeStatus.submit();
        })
    })
}
const btnDelete = document.querySelectorAll('[button-delete]');
if (btnDelete) {
    btnDelete.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const formDelete = document.querySelector("[form-delete]")
            const path = formDelete.getAttribute("path")
            const action = `${path}/${id}?_method=DELETE`
            formDelete.action = action;
            formDelete.submit();
        })
    })
}