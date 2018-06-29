const Reservation = require('../models/reservation.model.js');

//CREATE: creating and saving a new reservation
exports.create = (req, res) => {
    //validating the name field is populated
    if(!req.body.name || !req.body.birthday) {
        return res.status(404).send({
            message: "Name cannot be empty"
        });
    }

    //Creating a new Reservation
    const reservation = new Reservation({
        name: req.body.name,
        birthday: req.body.birthday,
    });

    //Saving the reservation to the database
    reservation.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "An error occurred while creating the reservation."
        });
    });
};

//READ: Retrieve and return all reservations from the database
exports.findAll = (req, res) => {
    Reservation.find()
    .then(reservations => {
        res.send(reservations);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "An error occurred while retrieving the reservations."
        });
    });
};

//READ: Find a single reservation w/ reservationId in the url
exports.findOne = (req, res) => {
    Reservation.findById(req.params.reservationId)
    .then(reservation => {
        if(!reservation) {
            return res.status(404).send({
                message: "Reservation with id " + req.params.reservationId + " not found."
            });
        }
        res.send(reservation);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Reservation with id " + req.params.reservationId + " not found."
            });
        }
        return res.status(500).send({
            message: "Error retrieving reservation with id " + req.params.reservationId
        });
    });
};


//UPDATE: updating a reservation by the reservationId in the url
exports.update = (req, res) => {
    //validating the name field is populated
    if (!req.body.name) {
        return res.status(400).send({
            message: "Name content cannot be empty"
        });
    }

    //Find a reservation and update it w/ the request body
    Reservation.findByIdAndUpdate(req.params.reservationId, {
        name: req.body.name,
        birthday: req.body.birthday
    }, {new: true})
    .then(reservation => {
        if(!reservation) {
            return res.status(404).send({
                message: "Reservation with id " + req.params.reservationId + " not found."
            });
        }
        res.send(reservation);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Reservation with id " + req.params.reservationId + " not found."
            })
        }
        return res.status(500).send({
            message: "Error updating reservation with id " + req.params.reservationId
        });
    });
};


//DELETE: deleting a reservation w/ the reservationId in the url
exports.delete = (req, res) => {
    Reservation.findByIdAndRemove(req.params.reservationId)
    .then(reservation => {
        if(!reservation) {
            return res.status(404).send({
                message: "Reservation with id " + req.params.reservationId + " not found."
            });
        }
        res.send({ message: "Reservation successfully deleted" });
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Reservation with id " + req.params.reservationId + " not found."
            });
        }
        return res.status(500).send({
            message: "Could not delete not with id " + req.params.reservationId
        });
    });
};


var records = [
    { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] }
  , { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
];

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}
