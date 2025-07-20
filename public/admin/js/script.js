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
                const id = input.value
                if (typeChange === "changePosition") {
                    const position = input.closest("tr").querySelector("input[name='position']").value;

                    ids.push(`${id}-${position}`)

                } else {
                    ids.push(id)
                }

            })
            inputIds.value = ids.join(", ")
            formChangeMulti.submit();
        } else {
            alert("Vui lòng chọn sản phẩm")
        }
    })

}

// alert
const showAlert = document.querySelector("[show-alert]")
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    console.log(time);

    const closeAlert = showAlert.querySelector("[close-alert]")
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden")
    })

    setTimeout(() => {
        showAlert.classList.add("alert-hidden")

    }, time)

}

// end alert

// preview img
const uploadImage = document.querySelector("[upload-image]")
if (uploadImage) {
    const imgInput = document.querySelector("[upload-image-Input]")
    const imgPreview = document.querySelector("[upload-image-preview]")
    const closePreview = document.querySelector("[close-image]")
    closePreview.addEventListener("click", () => {
        closePreview.classList.add("d-none")
        imgInput.value = "";
        imgPreview.src = "";
    })
    imgInput.addEventListener("change", (e) => {
        console.log(e);

        const [file] = e.target.files
        if (file) {
            console.log(file);
            closePreview.classList.remove("d-none")
            imgPreview.src = URL.createObjectURL(file);
        } else {

            imgPreview.src = "";
        }

    })

}
const selectSort = document.querySelector("[sort-select]")
const sortClear = document.querySelector("[sort-clear]")
console.log(selectSort);
// Sắp xếp
if (selectSort) {
    const url = new URL(window.location.href)
    selectSort.addEventListener("change", (e) => {


        const [key, value] = e.target.value.split("-")
        url.searchParams.set("sortKey", key)
        url.searchParams.set("sortValue", value)
        window.location.href = url.href;


    })
    sortClear.addEventListener("click", () => {

        url.searchParams.delete("sortKey")
        url.searchParams.delete("sortValue")
        window.location.href = url.href;
    })
    // thêm selected
    const sortKey = url.searchParams.get("sortKey")
    const sortValue = url.searchParams.get("sortValue")
    if (sortKey && sortValue) {
        const stringSort = `${sortKey}-${sortValue}`
        const optionSelected = selectSort.querySelector(`option[value=${stringSort}]`)
        optionSelected.selected = true

    }
}
