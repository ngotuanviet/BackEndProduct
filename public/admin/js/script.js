// Button Status
const buttonStatus = document.querySelectorAll('[button-status]');
const button = document.querySelectorAll('button');

if (button.length > 0) {
    button.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.add("active");
        })
    })
}
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);

    console.log(url);
    buttonStatus.forEach(btn => {
        btn.addEventListener("click", () => {
            const status = btn.getAttribute("button-status");
            if (status) {
                url.searchParams.set("status", status);

            } else {
                url.searchParams.delete("status");
                url.searchParams.delete("keyword");

            }
            window.location.href = url.href;
        })
    })
};
// form search
const search = document.querySelector("#searchForm")
console.log(search);
if (search) {
    search.addEventListener("submit", (e) => {
        e.preventDefault()
        let url = new URL(window.location.href);
        let keyword = e.target.elements.keyword.value
        console.log(keyword);
        if (keyword) {
            url.searchParams.set("keyword", keyword.trim());
        } else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
        console.log(window.location.href);

    })
}
const navigationItem = document.querySelectorAll(".page-link")

if (navigationItem.length > 0) {
    navigationItem.forEach(item => {
        item.addEventListener("click", () => {
            let url = new URL(window.location.href);
            let numberPage = item.getAttribute("button-pagination")
            console.log(numberPage);
            url.searchParams.set("page", numberPage);
            window.location.href = url.href;
            console.log(window.location.href);

        })
    })

}


