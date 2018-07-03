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


    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/edit',
            failureRedirect: '/login.html'
        })
    );

    app.get('/logout', function (req, res) {
        req.logout();
        console.log('User logged out.')
        res.redirect('/');
    });

    app.get('/edit', function(req, res, next) {
        if (req.user) {
            console.log("User is logged in")
            res.sendFile('/edit.html', {root: './views/'});
            
        } else {
            res.send('You cannot view this page. Sorry.');
        }
      });

}

// module.exports = router;