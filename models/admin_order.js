var pg = require('pg');
var settings = require('../settings.js');
var orderid = require('./order_id.js');
var calPrice = require('./price_cal.js');
var logger = require('../log').logger;

exports.queryOrders = function(venueId, limit, offset, callback) {
    pg.connect(settings.psqldb, function(err, client, done) {
        if (err) {
            done(client);
            return callback(err);
        }

        var qStr = "select * from " + settings.order_table + " where venue_id=" + venueId + " order by order_id desc limit " + limit + " offset " + offset;
        logger.debug(qStr);

        client.query(qStr, function(err, result) {
            done(client);
            if (err) 
                return callback(err);
            return callback(null, result.rows);
        });
}

exports.cancelOrder = function (venueId, orderId, callback) {
    
}

exports.UpdateOrder = function (venueId, orderId, stat, callback) {
}
