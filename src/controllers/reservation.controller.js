const Reservation = require('../models/reservation.model.js');
const nodemailer = require('nodemailer');
const config = require('../config');

//CREATE: creating and saving a new reservation
exports.create = (req, res) => {
    //validating the name field is populated
    if (!req.body.name || !req.body.birthday) {
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


    // This is the NodeMailer code for the automatic email notification
    const emailInfo = `
    <h3>A new birthday has been submitted !!</h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Birthday: ${req.body.birthday}</li>
    </ul>
    `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.mail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'timpinkerton@mail.com',
            pass: `${config.nodemailer.pass}`
        },
        // tls: {
        //     rejectUnauthorized: false
        // }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"A&D" <timpinkerton@mail.com>', // sender address
        to: 'timpinkerton@mail.com', // list of receivers
        subject: 'New Birthday Added!', // Subject line
        text: 'Hello world?', // plain text body
        html: emailInfo // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

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
            if (!reservation) {
                return res.status(404).send({
                    message: "Reservation with id " + req.params.reservationId + " not found."
                });
            }
            res.send(reservation);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
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
        }, {
            new: true
        })
        .then(reservation => {
            if (!reservation) {
                return res.status(404).send({
                    message: "Reservation with id " + req.params.reservationId + " not found."
                });
            }
            res.send(reservation);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
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
            if (!reservation) {
                return res.status(404).send({
                    message: "Reservation with id " + req.params.reservationId + " not found."
                });
            }
            res.send({
                message: "Reservation successfully deleted"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Reservation with id " + req.params.reservationId + " not found."
                });
            }
            return res.status(500).send({
                message: "Could not delete not with id " + req.params.reservationId
            });
        });
    }