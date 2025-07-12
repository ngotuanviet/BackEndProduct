module.exports = (status, find) => {

    let filtersStatus = [
        {
            name: "Tất cả",
            status: "",
            class: "active",
        },
        {
            name: "Hoạt động",
            status: "active",
            class: "",
        },
        {
            name: "Không hoạt động",
            status: "inactive",
            class: ""
        }
    ]
    if (status) {
        find.status = status

        filtersStatus.forEach(filter => {
            filter.class = filter.status === status ? "active" : ""
        })
    }

    return filtersStatus
}