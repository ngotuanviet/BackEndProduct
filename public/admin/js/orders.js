const selectChangeStatus = document.querySelectorAll("select[select-status]");
if (selectChangeStatus.length > 0) {
  selectChangeStatus.forEach((select) => {
    select.addEventListener("change", () => {
      const formChange = select.closest("form");
      console.log(formChange);
      const urlOld = formChange.getAttribute("url-change");
      const id = select.getAttribute("data-id");

      const url = urlOld + `/${id}?_method=PATCH`;
      formChange.action = url;
      formChange.submit();
    });
  });
}
