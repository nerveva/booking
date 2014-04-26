var crypto = require('crypto');
var mongoose = require('mongoose');

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

var courtSchema = new mongoose.Schema(cSchema, {
    collection: 'courts'
});

var courtModel = mongoose.model('Court', courtSchema);

function Court(user, orders) {
    this.orders = orders;
    this.user = user
}

Court.prototype.book = function(callback){

    //var res = {};
    //res.sucNum = 0;
    //res.details = new Array();
    //console.log(orders);
    /*
    for(var i = 0; i < orders.length; ++i) {
        var q = {
            PlanDetailId : orders[i].pid,
            _id : orders[i].sign,
            ReserveStatus : 0
        }

        var t = new Date();
        var m = {
            ReserveStatus : 1,
            LastModifyTime : t.getTime(),
            LastModifyUser : user
        }

        courtModel.update(q, m, function(err, numAffected){
            if (err) {
                console.log(err);
                //return callback(err);
                res.details.push(-1);
            }
            else {
                res.sucNum++;
                res.details.push(0);
            }

        });
    }*/
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

Court.prototype.rollBack = function(num, callback) {
    var m = {
        ReserveStatus : 0,
        LastModifyUser : ""
    };

    courtModel.update({PlanDetailId : {"$in" : this.orders}, ReserveStatus : 1, LastModifyUser : this.user}, m, {multi:true}, function(err, numAffected){
        if (err) {
            return callback(err);
        }
        if (num != numAffected) {
            return callback(numAffected);
        }

        return callback(null);
    });
};

Court.query = function(venue, dateTime, callback){
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

Court.init = function(venue, dateTime, callback){
    console.log(venue);
    for(var i = 0; i < venue.FieldList.length; ++i)
    {
        for(var j = venue.StartTime; j < venue.EndTime - 1; ++j){
            var court = {
                FieldId : venue.FieldList[i],
                PlanDetailId : dateTime + "-" + venue.FieldList[i] + "-" + j,
                StartTime : j,
                EndTime : j + 1,
                ReserveStatus : 0,
                Price : venue.PricePolicy.BasePrice,
                DateTime : dateTime,
                LastModifyTime : 0,
                LastModifyUser : ""
            };

            var newCourt = new courtModel(court);
            newCourt.save(function(err, court){
                if (err){
                    console.log(err);
                    return callback(err);
                }
            });
        };
    };
    callback(null);
};

Court.cancel = function(user, fieldList, callback) {
    courtModel.update({PlanDetailId : {"$in" : fieldList}, LastModifyUser : user}, {ReserveStatus : 0}, {multi:true}, function(err, numAffects) {
        if (err) {
            return callback(err);
        }

        /*if (numAffects != fieldList.length) {
            return callback("Wrong");
        }*/

        return callback(null);
    });
}

module.exports = Court;
