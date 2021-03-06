court = require('../models/court.js');
venue = require('../models/venue.js');
order = require('../models/order.js')

var StatusMap = {
    1 : "未付款",
    2 : "已付款",
    3 : "已完成",
    4 : "取消"
};


function appendZero(s){
    return ("00" + s).substr((s + "").length);
}

function addDate(date,days){ 
    var d = new Date(date); 
    d.setDate(d.getDate() + days); 
    var m = d.getMonth() + 1; 
    return d.getFullYear() + '-'+ appendZero(m) + '-' + appendZero(d.getDate()); 
} 

exports.show = function(req, res){
        var content = new String();
        var date = new Date();
        

        console.log(req.query.date);
        for (var i = 0; i < 7; ++i) {
            dateTime = addDate(date, i);
            content = content + '<li><a href="javascript:void(0);" date="' + dateTime + '" onclick="QueryVenueFieldPlanDetail(1,\'' + dateTime + '\',\'1\')"';

            if (req.query.date == dateTime) {
                content += ' class="on"';
            }

            content += '>' + dateTime + '</a></li>'

        }
        res.render('book', { choose_date_time : req.query.date, book_show_content : content});
};

exports.query = function(req, res){

    venue.query(req.params['venueId'], function(err, venueInfo) {
        if (err) {
            console.log(err);
            var resMap = {"status" : 404};
            res.send(resMap.toString());
            return;
        }

        court.query(venueInfo, req.query.datetime, function(err, allCourts) {
            if (err) {
                console.log(err);
                var resMap = {"status" : 404};
                res.send(resMap.toString());
                return;
            }
            res.send(allCourts);
        });

    });
};

exports.initVenue = function(req, res) {
    var v = {
        VenueId : "1",
        VenueName : "xl'tennis venue",
        FieldList : [1,2],
        FieldNameList : [{FieldId : "1", FieldName : "11"}, {FieldId : "2", FieldName : "2"}],
        StartTime :8,
        EndTime : 22,
        PricePolicy : {BasePrice : 100}
    };

    venue.update(v, function(err) {
        if (err) {
            console.log(err);
            res.send(err);
            return;
        }
    });

    court.init(v, req.query.date, function(err){
        if (err)
            console.log(err);
            res.send(err);
            return;
    });

    res.send('ok');
};

exports.queryMyOrders = function(req, res) {
    var q = {
        User : req.session.user.name
    };
    order.queryByCondiction(q, function(err, orders){ 
        if (err){
            return res.redirect('/');
        }
        var tab = "";
        for(var i = 0; i < orders.length; ++i) {
            tab += "<tr>";
            tab += "<td>" + orders[i].OrderId.toString() + "</td>";
            tab += "<td>" + orders[i].FieldPlanIdList.toString() + "</td>";
            tab += "<td>" + orders[i].TotalFee + "</td>";
            tab += "<td><span class=\"label label-info\">" + StatusMap[orders[i].Status] + "</td>";
            tab += "<td><a href=\"cancel?id=" + orders[i].OrderId.toString() + "\" class=\"btn mini purple\"><i class=\"icon-edit\"></i>取消</a></td>";
            tab += "</tr>";
        }

        res.render('myorders',{'my_orders_table' : tab});
    });
}

exports.cancel = function(req, res) {
    var q = {
        User : req.session.user.name,
        OrderId : req.query.id
    };
    order.queryByCondiction(q, function(err, orders) {
        if (orders == 0) {
            return exports.queryMyOrders(req, res);
        }

        court.cancel(req.session.user.name, orders[0].FieldPlanIdList, function(err) {
            if (err) {
                return exports.queryMyOrders(req, res);
            }

            order.cancel(req.session.user.name, req.query.id, function(err, num) {
                return exports.queryMyOrders(req, res);
            });

        });

    });
}

exports.book = function(req, res) {
    var fList = new Array();

    for(var i = 0; i < req.body.urlParm.length; ++i){
        fList.push(req.body.urlParm[i].pid);
    }
    var c = new court(req.session.user.name, fList);
    var r = {};
    c.book(function(err, results) {
        if (err) {
            r["status"] = 400;
            r.msg = "由于系统原因，预定失败";
            return res.send(r);
        }
        else {
            if (results == 0) {
                order.newOrder(req.session.user.name, fList, req.body.totalPrice, function(err, o){
                    if (err) {
                        c.rollBack(fList.length, function(err){
                            //rollback
                            r["staus"] = "403";
                            r.msg = "由于系统原因，预定失败";
                            return res.send(r);
                        });
                    }
                    else {
                        r["status"] = "200";
                        r["url"] = o.OrderId.toString();
                        return res.send(r);
                    }
                });
            }
            else {
                c.rollBack(fList.length, function(err){
                    r["staus"] = "403";
                    r.msg = "预定发生冲突\n请重新预定";
                    return res.send(r);
                });
            }
        }
    });
}
