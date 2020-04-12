const access_key = 'eb2c545e98932f4b8ee9328f2ccfb0a3';

let visitorData; 

$(document).ready(function () {

    getVisitorInfo(); 
    
    submitVisitorInfo(); 

});

function getVisitorInfo() {

    // get the API result via jQuery.ajax
    return $.ajax({
        url: 'http://api.ipstack.com/check?access_key=' + access_key,   
        dataType: 'jsonp',
        success: function(json) {

            visitorData = {
                ip: (json.ip),
                type: (json.type),
                continent_code: (json.continent_code),
                continent_name: (json.continent_name),
                country_code: (json.country_code),
                country_name: (json.country_name),
                region_code: (json.region_code),
                region_name: (json.region_name),
                city: (json.city),
                zip: (json.zip), 
                latitude: (json.latitude), 
                longitude: (json.longitude) 
                // location_geoname_id: (json.location.geoname_id), 
                // location_capital: (json.location.capital),
                // location_languages_code: (json.location.languages[0].code),
                // location_languages_name: (json.location.languages[0].name),
                // location_languages_native: (json.location.languages[0].native),
                // location_country_flag: (json.location.country_flag),
                // location_county_flag_emoji: (json.location.country_flag_emoji),
                // location_country_flag_emoji_unicode: (json.location_country_flag_emoji_unicode),
                // location_calling_code: (json.location.calling_code), 
                // location_is_eu: (json.location.is_eu)            
            }
            // output the "zip" object;
            // alert(visitorData.zip);
        } 
    });
    
}

function submitVisitorInfo() {
    
    // POST request to write visitor data
    $.ajax({
        type: 'POST',
        url: '/visitors',
        data: JSON.stringify(visitorData),
        dataType: 'json',
        contentType: 'application/json',
    })
    .done(function (response) {
        console.log("visitor data added");
    })
    console.log('submitVisitorInfo function ran')

}

