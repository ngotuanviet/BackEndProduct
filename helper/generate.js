const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
const generateRandomNumber = (length) => {
    const Numbers = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Numbers.charAt(Math.floor(Math.random() * Numbers.length));

    }
    return result;
}
module.exports = {
    generateRandomString,
    generateRandomNumber
};