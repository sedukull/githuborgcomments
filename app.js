const express = require('express');
const bodyParser = require('body-parser');
const log = require('loglevel')
const allRoutes = require('express-list-endpoints');
const dbConfig = require('./config/database_config')
const appConfig = require('./config/app_config')
require('dotenv').config()


log.setDefaultLevel(log.levels.INFO);


const environment = process.env.NODE_ENV || 'development';
const servicePort = appConfig[environment].port;

log.info(`==== Environment Information: ${environment} ====`)

// create express app
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())

// database client module and database connection.
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig[environment].url, {
	useNewUrlParser: true
}).then(() => {
    log.info("Successfully connected to the database");    
}).catch(err => {
    log.info('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json(allRoutes(app))
});

// Handler for 404 -Resource Not Found
app.use((req, res, next) =>{
    res.status(404).send('we think you are lost!')
})

require('./app/routes/org.routes.js')(app);


// listen for requests
var server = app.listen(servicePort, () => {
    log.info(`Service started. Port: ${servicePort}`);
});
module.exports = server;
