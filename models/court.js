var crypto = require('crypto');
var pg = require('pg');
var settings = require('../settings.js');

var cSchema = {
    FieldId : String,
    PlanDetailId : String,
    StartTime : Number,
    EndTime : Number,
    ReserveStatus : Number, // 0 : free, 1 : lock, 2 : orderd
    Price : Number,
    DateTime : String,
    LastModifyTime : Number,
    LastModifyUser : String
};

exports.book = function(callback){

    var self = this;
    var t = new Date();
    var m = {
        ReserveStatus : 1,
        LastModifyTime : t.getTime(),
        LastModifyUser : this.user
    }
    courtModel.update({PlanDetailId : {"$in" : this.orders}, ReserveStatus : 0}, m, {multi:true},function(err, numAffected) {
        if (err) {
            callback(err);
        }
        if (numAffected != self.orders.length) {
            console.log("N" + numAffected);
            callback(null, -1);
        }
        else {
            callback(null, 0);
        }
    });
};

exports.query = function(venue, dateTime, callback){
    var res = {};
    res["data"] = new Array();
    res["tList"] = new Array();
    res["vList"] = venue.FieldNameList;

    for (var i = venue.StartTime; i < venue.EndTime - 1; ++i) {
        var t = {};
        t["StartTime"] = i;
        t["EndTime"] = i + 1;
        res["tList"].push(t);
    }

    var newCourts = new Array();
    courtModel.find({FieldId : {"$in" : venue.FieldList}, DateTime : dateTime}, function(err, courts){
        if (err) {
            console.log(err);
            return callback(err);
        }

        for(var i = 0; i < courts.length; ++i) {
            var tmpC = {
                FieldId : courts[i].FieldId,
                PlanDetailId : courts[i].PlanDetailId,
                StartTime : courts[i].StartTime,
                EndTime : courts[i].EndTime,
                ReserveStatus : courts[i].ReserveStatus,
                Price : courts[i].Price,
                DateTime : courts[i].DateTime,
                sign : courts[i]._id
            }
            res["data"].push(tmpC);
        }

        res["total"] = courts.length;
        res["status"] = 200;
        return callback(null, res);
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
                       " (court_id, start_time, end_time, status, price, date_time) values ";
        var values = "";
        for(var i = 0; i < venue.FieldList.length; ++i){
            for(var j = venue.StartTime; j < venue.EndTime - 1; ++j){
                values += "(" +venue.FieldList[i] + "," + j + "," + (j + 1).toString() + ",0," + venue.PricePolicy.BasePrice + ",'" + dateTime + "'),";
            };
        };
        console.log(queryStr  + values.substr(0, values.length-1));

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
        for (var f in fieldList) {
            fields += f + ",";
        }
        fields = fields.substr(fields.length - 1) + ")";

        var queryStr = "update " + settings.court_table + " set status=0 where last_user='" + user +"' and plan_id in " + fields;
        client.query(queryStr, function(err, result) {
            done(client);
            return callback(err);
        });
        
    });
}
