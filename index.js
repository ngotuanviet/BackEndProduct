const express = require('express');

const route = require('./routes/client/index.routes');
const database = require('./config/database');

const app = express();
require('dotenv').config();
database.connect();
const port = process.env.PORT;

app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "pug");
route(app);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})