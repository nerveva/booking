var crypto = require('crypto');
var pg = require('pg');
var settings = require('../settings.js');

exports.query = function(venue, dateTime, callback){
    
    pg.connect(settings.psqldb, function(err, client, done) {
        if (err) {
            done(client);
            console.log(err);
            return callback(err);
        }

        var queryStr = "select * from " + settings.court_table + " where date_time='" + dateTime + "' and court_id in ";
        var fields = "(";
        var cJson = JSON.parse(venue.court_list);
        for(var i in cJson) {
            fields += "'" + i + "',";
        }
        fields = fields.substr(0, fields.length - 1) + ")";

        client.query(queryStr + fields, function(err, result) {
            done(client);
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(err, result.rows, result.rowCount);
        });
    });
};

exports.init = function(venue, dateTime, callback){
    pg.connect(settings.psqldb, function(err, client, done) {
        if (err) {
            done(client);
            console.log(err);
            return callback(err);
        }

        var queryStr = "insert into " + 
                       settings.court_table + 
                       " (court_id, start_time, end_time, venue_id, court_name, status, price, date_time) values ";
        var values = "";
        var cJson = JSON.parse(venue.court_list);
        for(var i in cJson){
            for(var j = venue.start_time; j < venue.end_time - 1; ++j){
                values += "(" + i + "," + j + "," + (j + 1).toString()+ "," + venue.venue_id + ",'" + cJson[i] +"',0," + JSON.parse(venue.price_policy).base_price + ",'" + dateTime + "'),";
            };
        };
        //console.log(queryStr  + values.substr(0, values.length-1));

        client.query(queryStr  + values.substr(0, values.length-1), function(err, result) {
            done(client);
            return callback(err);
        });
    });
};

exports.cancel = function(user, fieldList, callback) {
    pg.connect(settings.psqldb, function(err, client, done) {
        if (err) {
            done(client);
            console.log(err);
            return callback(err);
        }

        var fields = "(";
        for (var i = 0; i < fieldList.length; ++i) {
            fields += fieldList[i] + ",";
        }
        fields = fields.substr(0, fields.length - 1) + ")";

        var queryStr = "update " + settings.court_table + " set status=0 where last_user='" + user +"' and plan_id in " + fields;
        client.query(queryStr, function(err, result) {
            done(client);
            return callback(err);
        });
        
    });
}
