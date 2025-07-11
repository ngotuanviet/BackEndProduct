const express = require('express');
const route = require('./routes/client/index.routes');
const app = express();
require('dotenv').config();
const port = process.env.PORT
app.set("views", "./views");
app.set("view engine", "pug");
route(app);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})