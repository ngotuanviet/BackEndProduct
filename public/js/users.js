// Chức năng gửi yêu cầu
const ListBtnAddFriend = document.querySelectorAll("[btn-add-friend]")
if (ListBtnAddFriend.length > 0) {
    ListBtnAddFriend.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault()
            const userID = e.target.getAttribute("btn-add-friend")

            btn.closest(".box-user").classList.toggle("add")
            socket.emit("CLIENT_ADD-FRIEND", userID)

        })
    }
    )
}
// Đóng Chức năng gửi yêu cầu