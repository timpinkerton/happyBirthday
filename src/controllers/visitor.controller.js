const Visitor = require('../models/visitor.model.js');
// const config = require('../config');

//CREATE: creating and saving new visitor data
exports.create = (req, res) => {

    //Creating a new visitor
    const visitor = new Visitor({
        ip: req.body.ip,
        type: req.body.type,
        continent_code: req.body.continent_code,
        continent_name: req.body.continent_name,
        country_code: req.body.country_code,
        country_name: req.body.country_name,
        region_code: req.body.region_code,
        region_name: req.body.region_name,
        city: req.body.city,
        zip: req.body.zip, 
        latitude: req.body.latitude, 
        longitude: req.body.longitude 
    });

    //Saving the reservation to the database
    visitor.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Uh ohh, an error occurred while saving visitor data."
            });
        });

};;