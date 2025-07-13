const express = require('express');

const route = require('./routes/client/index.routes');
const routeAdmin = require('./routes/admin/index.routes');

const database = require('./config/database');
const system = require('./config/system');
const methodOverride = require('method-override')
const app = express();
require('dotenv').config();
database.connect();
const port = process.env.PORT;

app.use(methodOverride('_method'))
// var locals app 
app.locals.prefixAdmin = system.prefixAdmin;
app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "pug");

//route
route(app);
routeAdmin(app);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})