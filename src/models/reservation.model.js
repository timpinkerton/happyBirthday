// to load the mongoose package
const mongoose = require('mongoose');

const ReservationSchema = mongoose.Schema({
    name: String,
    birthday: { type: Date },
  },
  // timestamps option, mongoose automatically adds createdAt and updatedAt fields to the schema.
  {
    timestamps: true
  }
);

// turning the schema created above into a mongoose model
// an instance of a model is a document
// dbReservations is the collection in mLab
const Reservation = mongoose.model('dbreservations', ReservationSchema);
module.exports = Reservation;

