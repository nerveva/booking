var crypto = require('crypto');
var pg = require('pg');
var settings = require('../settings.js');
var pgutil = require('./pg_util.js');

var pricePolicy = {
    bp : Number,
    bmp : Number,
    sp: Number,
    smp : Number
};

exports.queryAll = function(callback) {
    pg.connect(settings.psqldb, function(err, client, done) {
        if (err) {
            done(client);
            console.log(err);
            return callback(err);
        }

        var queryStr = "select * from " + settings.venue_table;
        client.query(queryStr, function(err, res) {
            done(client);
            if (err) {
                return callback(err);
            }

            return callback(null, res.rows);
        });
    });
}

exports.query = function(venueId, callback){
    pg.connect(settings.psqldb, function(err, client, done) {
        if (err) {
            done(client);
            console.log(err);
            return callback(err);
        }

        var queryStr = "select * from " + settings.venue_table + " where venue_id=" + venueId;
        client.query(queryStr, function(err, res) {
            done(client);
            if (err) {
                return callback(err);
            }

            if (res.rowCount  != 1) {
                return callback("not found");
            }

            return callback(null, res.rows[0]);
        });
    });
};

exports.update = function(venue, callback) {
};

exports.newVenue = function(venue, callback) {
    pg.connect(settings.psqldb, function(err, client, done) {
        if (pgutil.handleErr(err, client, done)) {
            return callback(err);
        }

        client.query(pgutil.genInsertStat(settings.venue_table, venue), function(err) {
                done(client);
                return callback(err);
        });
    });
    
};

/*exports.update = function(venue, callback){
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
*/
