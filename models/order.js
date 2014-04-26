var crypto = require('crypto');
var mongoose = require('mongoose');
var orderid = require('./order_id.js')

var vSchema = {
    OrderId : String,
    User : String,
    FieldPlanIdList : Array,
    PayId : String,
    PayType : String, //alipay...
    TotalFee : Number,
    DateTime : String,
    Status : Number // 1 paying, 2 paied, 3 cancel, 4 timeout
};

var orderSchema = new mongoose.Schema(vSchema, {
    collection: 'orders'
});

var orderModel = mongoose.model('Order', orderSchema);

exports.queryByCondiction = function(con, callback){
    orderModel.find(con, function(err, orders){
        if (err) {
            console.log(err);
            return callback(err);
        }
        return callback(null, orders);
    });
};

exports.updateStatus = function(orderId, orderStatus, callback){
    // update
    orderModel.update({OrderId : orderId, Status : orderStatus}, order, function (err, numAffected) {
        if (err) {
            return callback(err);
        }
    });
    callback(null);
};

exports.newOrder = function(user, FieldIdList, TotalFee, callback) {
    orderid.getId(function(err, id){
        if (err) {
            return callback(err);
        }
        var d = new Date();
        var order = {
            OrderId : id,
            User : user,
            FieldPlanIdList : FieldIdList,
            PayId : id,
            PayType : "alipay", //alipay...
            TotalFee : TotalFee,
            DateTime : d.getTime().toString(),
            Status : 1 // 1 paying, 2 paied, 3 finsish, 4 cancel, 5 timeout
        };

        var nOrder = new orderModel(order);
        nOrder.save(function(err) {
            if (err) {
                return callback(err);
            } 

            callback(null, order);

        });
    });
}

exports.cancel = function(user, orderId, callback) {
    orderModel.update({User: user, OrderId : orderId}, {Status : 4}, function(err, numAffects) {
        return callback(err, numAffects);
    });
}
