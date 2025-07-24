const express = require('express');
const flash = require('express-flash');
const route = require('./routes/client/index.routes');
const routeAdmin = require('./routes/admin/index.routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const database = require('./config/database');
const moment = require('moment');
const system = require('./config/system');
const path = require('path');
const methodOverride = require('method-override')
const app = express();
require('dotenv').config();
database.connect();
const port = process.env.PORT;
// Flash

app.use(cookieParser('snjiewrtgrhfgbf'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End Flash
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
// var locals app 
app.locals.prefixAdmin = system.prefixAdmin;
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//route
route(app);
routeAdmin(app);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})