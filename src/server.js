// requiring necessary modules
const express = require('express');
const config = require('./config');
const session = require('express-session');
const bodyParser = require('body-parser');
// requiring and setting the path to use static files
const path = require('path');

const flash = require('connect-flash');
const records = require('./models/reservation.model.js');

// ************ Passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


// Configuring the local strategy to be used by passport
passport.use(new LocalStrategy(
    function (username, password, done) {
    records.findOne({
            username: username
        }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return done(null, user);
        });
    }
));


// Configuring Passport authenticated session persistence.
// Passport will serialize users into the session and deserialize users out of the session.
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});



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


app.use(session({
    secret: 'secrets',
    resave: true,
    saveUninitialized: true
}));


app.use(flash());

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());



app.get('/login',
function(req, res){
  res.sendFile('login.html', {'root': publicPath });
});


// Strategy for user login
app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/edit',
        failureRedirect: '/login',
        failureFlash: true
    })
);

// logout will redirect to the index page
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });


// app.use(bodyParser.json());

// this will be for all the other routes in the routes folder
// app.use('/api', router);

// requiring the reservations routes
require('./routes/index.js')(app);


// Starting the server
app.listen(config.port, () => {
    console.log(`${config.appName} is listening on port ${config.port}`);
});