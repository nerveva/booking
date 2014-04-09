var crypto = require('crypto');
var mongoose = require('mongoose');

var cSchema = {
    Action : String, //[order, cancel, pay]
    Id : Number,
    User : String,
    StartTime : Number,
    Status : Number, // 0 : Start, 1 : success, -1 : Failed
    LastModifyTime : Number,
    ActionInfo : String
};

var actionSchema = new mongoose.Schema(cSchema, {
    collection: 'actions'
});

var actionModel = mongoose.model('Action', actionSchema);

exports.query = function(venue, dateTime, callback){
    actionModel.find({FieldId : {"$in" : venue.FieldList}, DateTime : dateTime}, function(err, actions){
        if (err) {
            console.log(err);
            return callback(err);
        }

    });
};

exports.init = function(venue, dateTime, callback){
    console.log(venue);
    for(var i = 0; i < venue.FieldList.length; ++i)
    {
        for(var j = venue.StartTime; j < venue.EndTime - 1; ++j){
            var action = {
                FieldId : venue.FieldList[i],
                PlanDetailId : dateTime + "-" + venue.FieldList[i] + "-" + j,
                StartTime : j,
                EndTime : j + 1,
                ReserveStatus : 0,
                Price : venue.PricePolicy.BasePrice,
                DateTime : dateTime
            };
            console.log(action);

            var newAction = new actionModel(action);
            newAction.save(function(err, action){
                if (err){
                    console.log(err);
                    return callback(err);
                }
            });
        };
    };
    callback(null);
};

exports.beginAction = function(actions, callback) {
}

exports.endAction = function(actions, callback) {
}
