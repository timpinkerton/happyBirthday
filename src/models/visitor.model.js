// to load the mongoose package
const mongoose = require('mongoose');

const VisitorSchema = mongoose.Schema({
    ip: String,
    type: String,
    continent_code: String,
    continent_name: String,
    country_code: String,
    country_name: String,
    region_code: String,
    region_name: String,
    city: String,
    zip: String,
    latitude: { "type": "number" }, 
    longitude: { "type": "number" }
    // location_geoname_id: {type: int}, 
    // location_capital: (json.location.capital),
    // location_languages_code: (json.location.languages[0].code),
    // location_languages_name: (json.location.languages[0].name),
    // location_languages_native: (json.location.languages[0].native),
    // location_country_flag: (json.location.country_flag),
    // location_county_flag_emoji: (json.location.country_flag_emoji),
    // location_country_flag_emoji_unicode: (json.location_country_flag_emoji_unicode),
    // location_calling_code: (json.location.calling_code), 
    // location_is_eu: (json.location.is_eu)   
  },
  // timestamps option, mongoose automatically adds createdAt and updatedAt fields to the schema.
  {
    timestamps: true
  }
);

// turning the schema created above into a mongoose model
// an instance of a model is a document
// dbVisitors is the collection in mLab
const Visitor = mongoose.model('dbvisitors', VisitorSchema);
module.exports = Visitor;
