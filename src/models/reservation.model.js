// to load the mongoose package
const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    name: String,
    birthday: String,
    created_at: {
        type: Date,
        default: Date.now
    },
});

//turning the schema created above into a mongoose model
// an instance of a model is a document
const Reservation = mongoose.model('Reservation', ReservationSchema);
module.exports = Reservation;

Reservation.count({}, function(err, count) {
    if (err) {
      throw err;
    }
    if (count > 0) return ;

    const reservations = require('./reservation.seed.json');
    Reservation.create(reservations, function(err, newReservations) {
      if (err) {
        throw err;
      }
      console.log("DB seeded")
    });
  });