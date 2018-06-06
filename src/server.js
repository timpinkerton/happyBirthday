// requiring necessary modules
const express = require('express');
const config = require('./config');

// requiring and setting the path to use static files
const path = require('path');

// creating the application object
const app = express();

// creating the router object to allow the server to get to the other routes
const router = require('./routes');

const bodyParser = require('body-parser');

// load the mongoose package
const mongoose =require('mongoose');

//connecting to mongodb using the host & dbname from config/index.js
mongoose.connection.openUri(`mongodb://${config.db.username}:${config.db.password}@${config.db.host}/${config.db.dbName}`);

// Importing models
require('./models/reservation.model.js');

// path.resolve() resolves path segments into an absolute path
const publicPath = path.resolve(__dirname, '../public');

// express.static()  This will serve our static files (currently index.html in the public folder)
app.use(express.static(publicPath));

app.use(bodyParser.json());

// this will be for all the other routes in the routes folder
app.use('/api', router);

// Starting the server
app.listen(config.port, function () {
    console.log(`${config.appName} is listening on port ${config.port}`);
});