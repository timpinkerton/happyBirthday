const router = require('express').Router();

router.use('/doc', function (req, res, next) {
    res.end(`test page....... 1......2....3`);
});

// route to get a list of all the reservations. READ
router.get('/reservation', function (req, res, next) {
    res.json(RESERVATIONS);
});

// route for creating a new reservation. CREATE
router.post('/reservation', function (req, res, next) {
    res.end('Creates a new reservation');
});

// route to update a single reservation UPDATE
router.put('/reservation/:reservationId', function (req, res, next) {
    res.end(`Updating a reservation '${req.params.reservationId}'`);
});

// route to delete a single reservation.  DELETE
router.delete('/reservation/:reservationId', function (req, res, next) {
    res.end(`Deleting a reservation '${req.params.reservationId}'`);
});

// route to view a single reservation by id. READ
router.get('/reservation/:reservationId', function (req, res, next) {
    // same as 'const reservationId = req.params.reservationId'
    const {reservationId} = req.params;

    const reservation = RESERVATIONS.find(entry => entry.id === reservationId);
    // if there is no reservation with the requested id, an error message will display
    if (!reservation) {
      return res.status(404).end(`Could not find reservation '${reservationId}'`);
    }

    res.json(reservation);
  });


// test data
const RESERVATIONS = [{
        id: 'a',
        name: 'Sam',
        description: 'July',
        price: 20.0
    },
    {
        id: 'b',
        name: 'KG',
        description: 'June',
        price: 10.0
    },
    {
        id: 'c',
        name: 'Brody',
        description: 'September',
        price: 12.50
    },
    {
        id: 'd',
        name: 'Beckett',
        description: 'November',
        price: 15.0
    }
];

module.exports = router;