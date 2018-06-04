const router = require('express').Router();


// route to get a list of all the reservations. READ
router.get('/reservation', function (req, res, next) {
    res.json(RESERVATIONS);
});

// route for creating a new reservation. CREATE
router.post('/reservation', function (req, res, next) {
    const newID = '' + RESERVATIONS.length; 
    const data = req.body;
    data.id = newID; 

    RESERVATIONS.push(data);
    res.status(201).json(data);
});

// route to update a single reservation UPDATE
router.put('/reservation/:reservationId', function (req, res, next) {
    const {reservationId} = req.params;
    const reservation = RESERVATIONS.find(entry => entry.id === reservationId);

    if (!reservation) {
        return res.status(404).end(`Could not find the reservation for '${reservationId}'`);
    }

    reservation.name = req.body.name;
    reservation.birthday = req.body.birthday;
    res.json(reservation); 
});

// route to delete a single reservation.  DELETE
router.delete('/reservation/:reservationId', function (req, res, next) {
    res.end(`Deleting a reservation '${req.params.reservationId}'`);
});

// route to view a single reservation by id. READ
router.get('/reservation/:reservationId', function (req, res, next) {
    // same as 'const reservationId = req.params.reservationId'
    // able to get multiple req.params at once ex: {reservationId, name}
    const {reservationId} = req.params;

    const reservation = RESERVATIONS.find(entry => entry.id === reservationId);
    // if there is no reservation with the requested id, an error message will display
    if (!reservation) {
      return res.status(404).end(`Could not find reservation '${reservationId}'`);
    }

    res.json(reservation);
  });


// test data
// an array object assigned to the constant variable RESERVATIONS
const RESERVATIONS = [{
        id: 'a',
        name: 'Sam',
        birthday: 'July',
    },
    {
        id: 'b',
        name: 'KG',
        birthday: 'June',
    },
    {
        id: 'c',
        name: 'Brody',
        birthday: 'September',
    },
    {
        id: 'd',
        name: 'Beckett',
        birthday: 'November',
    },
    {
        id: 'e',
        name: 'Mom',
        birthday: 'May',
    },
];

module.exports = router;