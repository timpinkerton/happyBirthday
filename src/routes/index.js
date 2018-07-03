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
            successRedirect: '/edit.html',
            failureRedirect: '/login.html'
        })
    );
}

// module.exports = router;