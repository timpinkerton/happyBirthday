// requiring necessary modules
const express = require('express');
const config = require('./config');
const bodyParser = require('body-parser');

// requiring and setting the path to use static files
const path = require('path');


var port = process.env.PORT || 8080;


// modules needed for passportJS
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserDB = require('./UserDB');
const session = require('express-session');

// creating and configuring the LocalStragy
passport.use(new LocalStrategy(
    function (username, password, cb) {
        UserDB.users.findByUsername(username, function (err, user) {
            if (err) {
                return cb(err);
            }
            if (!user) {
                return cb(null, false);
            }
            if (user.password != password) {
                return cb(null, false);
            }
            return cb(null, user);
        });
    }));

// Configure Passport authenticated session persistence.
//
// This will restore authentication state across HTTP requests.
// Passport will serialize users into a session and deserialize users out of the session by supplying 
// the user ID when serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    UserDB.users.findById(id, function (err, user) {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});

// creating the express application object
const app = express();

// for session handling
app.use(session({
    secret: "secrets",
    resave: true,
    saveUninitialized: true
}));

// parse the requests w/ content type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// creating the router object to allow the server to get to the other routes
// const router = require('./routes');

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
require('./models/visitor.model.js');

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
// process.env.PORT is added since Heroku dynamically assigns the app to a port

// app.listen(process.env.PORT || config.port, () => {
//     console.log(`${config.appName} is listening on port ${config.port}`);
// });

app.listen(port, function() {
	console.log('The app is running on http://localhost:' + port);
});