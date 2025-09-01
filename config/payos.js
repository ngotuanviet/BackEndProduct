const PayOS = require("@payos/node");
const payOS = new PayOS(
    process.env.PAYOS_CLIENT_ID,
    process.env.PAYOS_API_KEY,
    process.env.PAYOS_CHECK_SUM_KEY
);

module.exports = payOS;