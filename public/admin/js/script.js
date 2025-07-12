// Button Status
const buttonStatus = document.querySelectorAll('[button-status]');
const button = document.querySelectorAll('button');
console.log(button);

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

            }
            window.location.href = url.href;
            consolelog(url);
        })
    })
};
