// alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  console.log(time);

  const closeAlert = showAlert.querySelector("[close-alert]");
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
}
// end alert
const apiCity = async () => {
  const res = await fetch("https://vietnamlabs.com/api/vietnamprovince");
  const data = await res.json();

  return data.data;
};
const cityName = document.querySelector("select[name='city_name']");
if (cityName) {
  window.addEventListener("load", async (e) => {
    const data = await apiCity();
    data.map((item) => {
      const option = document.createElement("option");
      option.value = item.province;
      option.innerText = item.province;
      cityName.appendChild(option);
    });
  });
  cityName.addEventListener("change", async (e) => {
    const valueSelected = cityName.value;
    const data = await apiCity();
    const filterData = data.filter((item) => item.province === valueSelected);
    const stateCity = document.querySelector("select[name='state_name']");

    stateCity.querySelectorAll("select option").forEach((item) => {
      item.remove();
    });
    filterData[0].wards.map((item) => {
      const option = document.createElement("option");
      option.value = item.name;
      option.innerText = item.name;
      stateCity.appendChild(option);
    });
  });
}
