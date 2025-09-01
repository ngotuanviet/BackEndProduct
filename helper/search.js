module.exports = (keyword) => {
    let objeactSearch = {
        keyword: keyword || "",
        regex: ""
    }
    if (objeactSearch.keyword) {
        objeactSearch.keyword = keyword
        const regex = new RegExp(objeactSearch.keyword, "i")
        objeactSearch.regex = regex

    }
    return objeactSearch
}

