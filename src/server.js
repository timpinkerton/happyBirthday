// requiring necessary modules
const express = require('express');
const config = require('./config');

// creating the application object
const app = express(); 


// This function tells the app what to do
app.use(function(req, res, next){
    res.send("Hello Pups!!!");
});


// Starting the server
app.listen(config.port, function() {
    console.log(`${config.appName} is listening on port ${config.port}`);
});