// Chức năng gửi yêu cầu
const ListBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (ListBtnAddFriend.length > 0) {
  ListBtnAddFriend.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const userID = e.target.getAttribute("btn-add-friend");

      btn.closest(".box-user").classList.add("add");
      socket.emit("CLIENT_ADD-FRIEND", userID);
    });
  });
}
// Đóng Chức năng gửi yêu cầu
// Chức năng huỷ gửi yêu cầu
const ListBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (ListBtnCancelFriend.length > 0) {
  ListBtnCancelFriend.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const userID = e.target.getAttribute("btn-cancel-friend");
      btn.closest(".box-user").classList.remove("add");
      socket.emit("CLIENT_CANCEL-FRIEND", userID);
    });
  });
}
// Đóng Chức năng huỷ gửi yêu cầu
// Chức năng từ chối yêu cầu kết bạn
const refuseFriend = (btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const userID = e.target.getAttribute("btn-refuse-friend");
    btn.closest(".box-user").classList.add("refuse");
    socket.emit("CLIENT_REFUSE-FRIEND", userID);
  });
};
const ListBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (ListBtnRefuseFriend.length > 0) {
  ListBtnRefuseFriend.forEach((btn) => {
    refuseFriend(btn);
  });
}
// Đóng Chức năng từ chối yêu cầu kết bạn
// Chức năng đồng ý yêu cần kết bạn
const acceptedFriend = (btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const userID = e.target.getAttribute("btn-accept-friend");
    btn.closest(".box-user").classList.add("accepted");
    socket.emit("CLIENT_ACCEPT-FRIEND", userID);
  });
};
const ListBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (ListBtnAcceptFriend.length > 0) {
  ListBtnAcceptFriend.forEach((btn) => {
    acceptedFriend(btn);
  });
}
// Đóng Chức năng đồng ý yêu cần kết bạn
// SERVER RETURN LENGTH ACCEPT FRIENDS
const elementListLengthAcceptFriends = document.querySelector(
  ".inner-list-length-accept-friends"
);
const badgeUsersAccept = document.querySelector("[badge-users-accept]");
if (badgeUsersAccept) {
  socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", (data) => {
    const user_ID = badgeUsersAccept.getAttribute("user-id");

    if (data.userID == user_ID) {
      badgeUsersAccept.innerHTML = `(${data.lengthAcceptFriends})`;
    }
  });
}
// end SERVER_RETURN_LENGTH_ACCEPT_FRIENDS
// SERVER_RETURN_INFO_USER_ACCEPT_FRIEND
const dataUsersAccept = document.querySelector("[data-users-accept]");

if (dataUsersAccept) {
  socket.on("SERVER_RETURN_INFO_USER_A", (data) => {
    const user_ID = dataUsersAccept.getAttribute("data-users-accept");
    // lời mời đã nhận

    if (data.userID == user_ID) {
      const div = document.createElement("div");
      // vẽ user ra giao diện
      div.classList.add("col-6");
      div.setAttribute("user-id", data.infoUserA._id);
      div.innerHTML = `
        <div class="box-user" ">
            <div class="inner-avatar">
                <img src=${data.infoUserA.avatar} alt="Blackcat">
                </div>
            <div class="inner-info">
                <div class="inner-name">${data.infoUserA.fullName}</div>
            <div class="inner-buttons">
                <button class="btn btn-sm btn-primary me-1" btn-accept-friend="${data.infoUserA._id}">Chấp nhận</button>
                <button class="btn btn-sm btn-secondary me-1" btn-refuse-friend="${data.infoUserA._id}">Xoá</button><button class="btn btn-sm btn-secondary me-1" btn-deleted-friend="${data.infoUserA._id}" disabled="">Đã xoá</button><button class="btn btn-sm btn-primary me-1" btn-accepted-friend="${data.infoUserA._id}" disabled="">Đã Chấp nhận</button>
                </div>
            </div>
        </div>
 
    `;
      dataUsersAccept.appendChild(div);
      // thêm sự kiện cho nút chấp nhận và từ chối
      const ListBtnAcceptFriend = div.querySelectorAll("[btn-accept-friend]");
      if (ListBtnAcceptFriend.length > 0) {
        ListBtnAcceptFriend.forEach((btn) => {
          acceptedFriend(btn);
        });
      }
      const ListBtnRefuseFriend = div.querySelectorAll("[btn-refuse-friend]");
      if (ListBtnRefuseFriend.length > 0) {
        ListBtnRefuseFriend.forEach((btn) => {
          refuseFriend(btn);
        });
      }
    }
    // Trang danh sách người dùng
    const dataUserNotFriend = document.querySelector("[data-users-not-friend]");
    if (dataUserNotFriend) {
      const userID = dataUserNotFriend.getAttribute("data-users-not-friend");
      if (userID === data.userID) {
        const boxUserRemove = document.querySelector(
          `.col-6[user-id="${data.infoUserA._id}"]`
        );

        if (boxUserRemove) {
          dataUserNotFriend.removeChild(boxUserRemove);
        }
      }
    }
  });
}

// SERVER_RETURN_USER_ID_ADD_FRIEND
socket.on("SERVER_RETURN_USER_ID_ADD_FRIEND", (data) => {
  const dataUserNotFriend = document.querySelector("[data-users-not-friend]");
  if (dataUserNotFriend) {
    const userID = dataUserNotFriend.getAttribute("data-users-not-friend");
    if (userID === data.userIDB) {
      const boxUserRemove = document.querySelector(
        `.col-6[user-id="${data.userIDA}"]`
      );

      if (boxUserRemove) {
        dataUserNotFriend.removeChild(boxUserRemove);
      }
    }
  }
});

// SERVER_RETURN_INFO_ACCEPT_FRIENDS
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
  const boxUserRemove = document.querySelector(
    `.col-6[user-id="${data.userIDA}"]`
  );

  if (boxUserRemove) {
    const dataUsersAccept = document.querySelector("[data-users-accept]");
    const userIDB = badgeUsersAccept.getAttribute("user-id");
    if (userIDB === data.userIDB) {
      dataUsersAccept.removeChild(boxUserRemove);
    }
  }
});
