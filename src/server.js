// requiring necessary modules
const express = require('express');
const config = require('./config');
const bodyParser = require('body-parser');
// requiring and setting the path to use static files
const path = require('path');

// creating the application object
const app = express();

// creating the router object to allow the server to get to the other routes
// const router = require('./routes');

// parse the requests w/ content type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// parse requests w/ content type - application/json
app.use(bodyParser.json());

// load the mongoose package
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//connecting to mongodb using the host & dbname from config/index.js
mongoose.connection.openUri(`mongodb://${config.db.username}:${config.db.password}@${config.db.host}/${config.db.dbName}`)
    .then(() => {
        console.log("Successfully connected to the database!");
    }).catch(err => {
        console.log("Unable to connect to the database.");
        process.exit();
    });

// Importing models
require('./models/reservation.model.js');

// path.resolve() resolves path segments into an absolute path
const publicPath = path.resolve(__dirname, '../public');

// express.static()  This will serve our static files (currently index.html in the public folder)
app.use(express.static(publicPath));


// app.use(bodyParser.json());

// this will be for all the other routes in the routes folder
// app.use('/api', router);

// requiring the reservations routes
require('./routes/index.js')(app);

// Starting the server
app.listen(config.port, () => {
    console.log(`${config.appName} is listening on port ${config.port}`);
});