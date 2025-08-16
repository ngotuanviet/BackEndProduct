// Chức năng gửi yêu cầu
const ListBtnAddFriend = document.querySelectorAll("[btn-add-friend]")
if (ListBtnAddFriend.length > 0) {
    ListBtnAddFriend.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault()
            const userID = e.target.getAttribute("btn-add-friend")

            btn.closest(".box-user").classList.add("add")
            socket.emit("CLIENT_ADD-FRIEND", userID)

        })
    }
    )
}
// Đóng Chức năng gửi yêu cầu
// Chức năng huỷ gửi yêu cầu
const ListBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]")
if (ListBtnCancelFriend.length > 0) {
    ListBtnCancelFriend.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault()
            const userID = e.target.getAttribute("btn-cancel-friend")
            btn.closest(".box-user").classList.remove("add")
            socket.emit("CLIENT_CANCEL-FRIEND", userID)

        })
    }
    )
}
// Đóng Chức năng huỷ gửi yêu cầu
// Chức năng từ chối yêu cầu kết bạn
const ListBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]")
if (ListBtnRefuseFriend.length > 0) {
    ListBtnRefuseFriend.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault()
            const userID = e.target.getAttribute("btn-refuse-friend")
            btn.closest(".box-user").classList.add("refuse")
            socket.emit("CLIENT_REFUSE-FRIEND", userID)

        })
    }
    )
}
// Đóng Chức năng từ chối yêu cầu kết bạn