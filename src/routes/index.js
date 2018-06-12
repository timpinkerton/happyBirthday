// const router = require('express').Router();
// const mongoose = require('mongoose');


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
}

// module.exports = router;