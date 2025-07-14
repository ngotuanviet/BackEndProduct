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

    // console.log(url);
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


    })
}
const navigationItem = document.querySelectorAll("[button-pagination]")



if (navigationItem.length > 0) {
    navigationItem.forEach(item => {
        item.addEventListener("click", () => {
            console.log("oke");

            let url = new URL(window.location.href);
            let numberPage = item.getAttribute("button-pagination")
            console.log(numberPage);
            url.searchParams.set("page", numberPage);
            window.location.href = url.href;


        })
    })

}
// CheckBox Multi
const checkBoxMulti = document.querySelector("[checkbox-multi]")


if (checkBoxMulti) {
    const inputCheckAll = checkBoxMulti.querySelector("input[name='checkall']")
    const inputsId = checkBoxMulti.querySelectorAll("input[name='ids']")
    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true;
            });

        } else {
            inputsId.forEach(input => {
                input.checked = false;
            });

        }
    })
    inputsId.forEach(inputId => {
        inputId.addEventListener("click", () => {
            let checkAll = true;
            inputsId.forEach(input => {
                if (!input.checked) {
                    checkAll = false;
                }
            });
            inputCheckAll.checked = checkAll;
        })
    })
    console.log(inputsId);

}
// form Change multi

const formChangeMulti = document.querySelector("#form-change-multi")
if (formChangeMulti) {

    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault()
        const checkBoxMulti = document.querySelector("[checkbox-multi]")
        const inputChecked = document.querySelectorAll("input[name='ids']:checked")

        const typeChange = e.target.type.value
        if (typeChange === "deleteAll") {
            const isCorfirm = confirm("Bạn có muốn xoá những sản phẩm này?")
            if (!isCorfirm) {
                return;
            }
        }
        console.log(typeChange);

        if (inputChecked.length > 0) {
            const inputIds = formChangeMulti.querySelector("input[name='ids']")
            let ids = []
            inputChecked.forEach(input => {
                ids.push(input.value)
            })
            inputIds.value = ids.join(", ")
            formChangeMulti.submit();
        } else {
            alert("Vui lòng chọn sản phẩm")
        }
    })

}


