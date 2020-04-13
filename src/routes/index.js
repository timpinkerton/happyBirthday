// const router = require('express').Router();
// const mongoose = require('mongoose');
const passport = require('passport');


module.exports = (app) => {
    const reservations = require('../controllers/reservation.controller.js');

    //CREATE a new reservation
    app.post('/reservations', reservations.create);

    //READ all reservations
    app.get('/reservations', reservations.findAll);

    //READ a single reservation w/ the reservationId
    app.get('/reservations/:reservationId', reservations.findOne);

    //UPDATE a reservation w/ the reservationID
    app.put('/reservations/:reservationId', reservations.update);

    //DELETE a reservation w/ the reservationID
    app.delete('/reservations/:reservationId', reservations.delete);

    // Calling authenticate method when submitting a username and password
    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/edit',
            failureRedirect: '/login.html'
        })
    );

    // When the logout button is clicked, the user is logged out and redirected to the index page
    app.get('/logout', function (req, res) {
        req.logout();
        console.log('User logged out.')
        res.redirect('/');
    });

    //Route for Edit page.  Check to see if user is logged in.  If not message is relayed.
    app.get('/edit', function(req, res, next) {
        if (req.user) {
            console.log("User is logged in")
            res.sendFile('/edit.html', {root: './views/'});
            
        } else {
            res.send('You cannot view this page. Sorry.');
        }
      });


    const visitors = require('../controllers/visitor.controller.js');

    //CREATE a visitor post
    app.post('/visitors', visitors.create);

}

// module.exports = router;