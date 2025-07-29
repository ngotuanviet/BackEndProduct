const inputQuantity = document.querySelectorAll("input[name=quantity]")
if (inputQuantity) {
    inputQuantity.forEach(item => {
        item.addEventListener("change", (e) => {
            const productID = item.getAttribute("product-id")
            const quantity = e.target.value


            window.location.href = `/cart/update/${productID}/${quantity}`


        })
    })

}