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
        
        var qStr = "select * from " + settings.order_table;
        var conStr = "";
        for(var k in con) {
            conStr += k + "='" + con[k] + "' and ";
        }
        if (conStr.length > 0) {
            conStr = " where " + conStr.substr(0, conStr.length - 5);
        }
        qStr += conStr;
        
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

var getFields = function(FieldIdList) {
    var fields = "(";
    for(var i  = 0; i < FieldIdList.length; ++i) {
        fields += "'" + FieldIdList[i] + "',";
    }
    return fields.substr(0, fields.length-1) + ")";
}

exports.newOrder = function(user, FieldIdList, TotalFee, callback) {
    pg.connect(settings.psqldb, function(err, client, done) {
        if (err) {
            done(client);
            console.log(err);
            return callback(err);
        }
        
        var updateFields = "update " + settings.court_table + 
                           " set status=1,last_time=current_timestamp(0)::timestamp without time zone,last_user='" + 
                           user 
                           + "' where plan_id in " + getFields(FieldIdList) + " and status=0";

        var newOrder = "insert into " + settings.order_table + "(order_user, order_time, courts_list, total_price, status) values('" + user + "',current_timestamp(0)::timestamp without time zone,'" + FieldIdList.toString() + "'," + TotalFee + ",1)";

        client.query('BEGIN isolation level serializable', function(err) {
            if (err) { 
                console.log(err);
                return rollback(client, done, callback);
            }

            client.query(updateFields, function(err, result) {
                if (err) {
                    console.log(err);
                    return rollback(client, done, callback);
                }
                if (result.rowCount != FieldIdList.length) {
                    console.log("rowCount");
                    return rollback(client, done, callback);
                }
                
                client.query(newOrder, function(err, result) {
                if (err) {
                    console.log(err);
                    return rollback(client, done, callback);
                }
                console.log(result);

                client.query("COMMIT", function(err){
                    done(client);
                    return callback(err);
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
        var queryOrderStr = "select courts_list from " + settings.order_table + " where order_user='" + user + "' and order_id=" + orderId;

        var updateOrderStr = "update " + settings.order_table + " set status=4 where order_user='" + user + "' and order_id=" + orderId;
       client.query(queryOrderStr, function(err, orderRes) {
           if (err || orderRes.rowCount != 1) {
               console.log(err);
               done(client);
               callback("err");
           }
           client.query("BEGIN", function(err) {
               if(err) {
                   console.log(err);
                   return rollback(client, done, callback);
               }

               client.query(updateOrderStr, function(err) {
                   if(err) {
                       console.log(err);
                       return rollback(client, done, callback);
                   }
                   var updateFields = "update " + settings.court_table + 
                   " set status=0,last_time=current_timestamp(0)::timestamp without time zone,last_user='" + 
                   user 
                   + "' where plan_id in " + getFields(orderRes.rows[0].courts_list.split(','));

                   client.query(updateFields, function(err) {
                       if(err) {
                           console.log(err);
                           return rollback(client, done, callback);
                       }

                       client.query("COMMIT", function(err) {
                           return callback(err);
                       });
                   });
               });
           }); 
       
       });
    });
}
