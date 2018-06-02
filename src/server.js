// requiring necessary modules
const express = require('express');
const config = require('./config');

// requiring and setting the path to use static files
const path = require('path');

// creating the application object
const app = express(); 

// creating the router object to allow the server to get to the other routes
const router = require('./routes');


// path.resolve() resolves path segments into an absolute path
const publicPath = path.resolve(__dirname, '../public');

// express.static()  This will serve our static files (currently index.html in the public folder)
app.use(express.static(publicPath));

// this will be for all the other routes in the routes folder
app.use('/api', router);

// Starting the server
app.listen(config.port, function() {
    console.log(`${config.appName} is listening on port ${config.port}`);
});