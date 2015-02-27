var crypto = require('crypto');
var mongoose = require('mongoose');

var vSchema = {
    OrderId : Number,
    Tag : String
};

var orderIdSchema = new mongoose.Schema(vSchema, {
    collection: 'orderIds'
});

var orderIdModel = mongoose.model('OrderId', orderIdSchema);

exports.getId = function(callback){
    // update
    orderIdModel.findOneAndUpdate({Tag : "orderId"}, {$inc : {OrderId : 1}}, {upsert : true}, function (err, oId) {
        if (err) {
            return callback(err);
        }
        callback(null, oId.OrderId);
    });
};

