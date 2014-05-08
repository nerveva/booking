var crypto = require('crypto');
var pg = require('pg');
var settings = require('../settings.js');


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


exports.queryByCondiction = function(con, callback){
    pg.connect(settings.psqldb, function(err, client, done) {
        if (err) {
            done(client);
            console.log(err);
            return callback(err);
        }
        
        var qStr = "select * from " + settings.court_order;
        if (con.length > 0) {
            qStr += " where ";
            for(var k in con) {
                qStr += k + "=" + con[k] + " and ";
            }
            qStr = qStr.substr(0, qStr.length - 5);

        }
        client.query(qStr, function(err, result) {
            done(client);
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result.rows);
        });
    });
};

exports.updateStatus = function(orderId, oldStatus, newStatus, callback){
    pg.connect(settings.psqldb, function(err, client, done) {
        if (err) {
            done(client);
            console.log(err);
            return callback(err);
        }

        var queryStr = "update " + settings.order_table + " set status=" + newStatus + " where status=" + oldStatus;
        client.query(queryStr, function(err, result) {
            done(client);
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, result.rowCount);
        });
    });
};

var rollback = function(client, done, callback) {
  client.query('ROLLBACK', function(err) {
    //if there was a problem rolling back the query
    //something is seriously messed up.  Return the error
    //to the done function to close & remove this client from
    //the pool.  If you leave a client in the pool with an unaborted
    //transaction __very bad things__ will happen.
    done(err)
    return callback("err");
  });
};

exports.newOrder = function(user, FieldIdList, TotalFee, callback) {
    pg.connect(settings.psqldb, function(err, client, done) {
        if (err) {
            done(client);
            console.log(err);
            return callback(err);
        }
        var fields = "(";
        for(var i in FieldIdList) {
            fields += "'" + i + "',";
        }
        fields = fields.substr(0, fields.length-1) + ")";
        var updateFields = "update " + settings.court_table + " set status=2,last_user=" + user 
                           + " where plan_id in " + fields + " and status=1";

        var newOrder = "insert into " + settings.order_table + "{order_user, order_time, courts_list, status} values(" + user + ",current_timestamp(0)::timestamp without time zone," + FieldIdList + ",status=1)";

        client.query('BEGIN isolation level serializable', function(err) {
            if (err)  
                return rollback(client, done, callback);

            client.query(updateFields, function(err, result) {
                if (err)
                    return rollback(client, done, callback);
                if (result.rowCount != FieldIdList.length)
                    return rollback(client, done, callback);
                
                client.query(newOrder, function(err, result) {
                if (err)
                    return rollback(client, done, callback);

                    client.query("COMMIT", function(err){
                        done(client);
                        return callback(null);
                    });
                }); 
            });

        });
    });

}

exports.cancel = function(user, orderId, callback) {
    pg.connect(settings.psqldb, function(err, client, done) {
        if (err) {
            done(client);
            console.log(err);
            return callback(err);
        }
        var queryStr = "update " + settings.order_table + " set status=4 where order_user='" + user + "' and orderId=" + orderId;
       client.query(queryStr, function(err, result) {
           done(client);
           return callback(err);
       }); 
    });
}
