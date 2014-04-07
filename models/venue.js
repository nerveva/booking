var crypto = require('crypto');
var mongoose = require('mongoose');

var pricePolicy = {
    BasePrice : Number
};

var fieldName = {
    FieldId : String,
    FieldName : String
};

var vSchema = {
    VenueId : String,
    VenueName : String,
    FieldList : Array,
    FieldNameList : Array,
    StartTime : Number,
    EndTime : Number,
    PricePolicy : pricePolicy
};

var venueSchema = new mongoose.Schema(vSchema, {
    collection: 'venues'
});

var venueModel = mongoose.model('Venue', venueSchema);

exports.query = function(venueId, callback){
    venueModel.findOne({VenueId : venueId}, function(err, v){
        if (err) {
            console.log(err);
            return callback(err);
        }
        return callback(null, v);
    });
};

exports.update = function(venue, callback){
    var isNew = false;
    exports.query(venue.VenueId, function (err, tVenue) {
        console.log("query");
        console.log(err);
        if (tVenue) {
            isNew = true;
        }
    });

    if (isNew) {
        // save new venue
        var newVenue = new venueModel(venue);
        newVenue.save(function(err, venue){
            if (err){
                console.log(err);
                return callback(err);
            }
        });
        callback(null);
    }
    else {
        // update
        venueModel.update({VenueId : venue.VenueId}, venue, function (err, numAffected) {
            if (err) {
                return callback(err);
            }
        });
        callback(null);
    }
};

