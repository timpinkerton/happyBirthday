// requiring necessary modules
const express = require('express');
const config = require('./config');

// requiring and setting the path to use static files
const path = require('path');

// creating the application object
const app = express(); 


// path.resolve() resolves path segments into an absolute path
const publicPath = path.resolve(__dirname, '../public');

// express.status()
app.use(express.static(publicPath));

// This function tells the app what to do
app.use(function(req, res, next){
    res.send('This text will no longer appear');
});


// Starting the server
app.listen(config.port, function() {
    console.log(`${config.appName} is listening on port ${config.port}`);
});