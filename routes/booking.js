court = require('../models/court.js');
mvenue = require('../models/venue.js');
order = require('../models/order.js')
var calPrice = require('../models/price_cal.js')

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

        for (var i = 0; i < 7; ++i) {
            dateTime = addDate(date, i);
            content = content + '<li><a href="javascript:void(0);" date="' + dateTime + '" onclick="QueryVenueFieldPlanDetail(' + req.query.venue + ',\'' + dateTime + '\',\'1\')"';

            if (req.query.date == dateTime) {
                content += ' class="on"';
            }

            content += '>' + dateTime + '</a></li>'

        }
        res.render('book', { choose_date_time : req.query.date, book_show_content : content});
};

exports.query = function(req, res){

    mvenue.query(req.params['venueId'], function(err, venueInfo) {
        if (err) {
            console.log(err);
            var resMap = {"status" : 404};
            res.send(resMap.toString());
            return;
        }

        court.query(venueInfo, req.params['datetime'], function(err, all, count) {
            if (err) {
                console.log(err);
                var resMap = {"status" : 404};
                res.send(resMap.toString());
                return;
            }
            var retjson = {};
            retjson["data"] = new Array();
            retjson["vList"] = new Array();
            
            var cJson = JSON.parse(venueInfo.court_list);
            var cList = new Array();
            for(var i in cJson) {
                retjson["vList"].push({ FieldName :cJson[i],
                    FieldId : i});
                cList.push(i);
            }

            var pList = new Array();
            retjson["st"] = venueInfo.start_time;
            retjson["et"] = venueInfo.end_time

            for(var i = 0; i < all.length; ++i) {
                var tmpC = {
                    fid : all[i].court_id,
                    pid : all[i].plan_id,
                    st : all[i].start_time,
                    et : all[i].end_time,
                    s : all[i].status,
                    p : all[i].price,
                    dt : req.params['datetime']
                }
                retjson["data"].push(tmpC);
                pList.push(all[i].plan_id);
            }

            for (var i = venueInfo.start_time; i < venueInfo.end_time; ++i) {
                for(var j = 0; j < cList.length; ++j){
                    var id = req.params['datetime'] 
                        + "-" + venueInfo.venue_id
                        + "-" + cList[j] + "-" + i;
                    if (pList.indexOf(id) == -1) {
                        var tmpC = {
                            fid : cList[j],
                            pid : id,
                            st : i,
                            et : i + 1,
                            s : 0,
                            p : calPrice(venueInfo.price_policy, i, req.query.datetime),
                            dt : req.query.datetime
                        }
                        retjson["data"].push(tmpC);
                    }
                }
            }
            retjson["total"] = cList.length * (venueInfo.end_time - venueInfo.start_time - 1);
            retjson["status"] = 200;
            return res.send(retjson);
        });

    });
};

exports.initCourt = function(req, res) {

    mvenue.query(req.query.venue, function(err, v) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        court.init(v, req.query.date, function(err){
            if (err) {
                console.log(err);
                return res.send(err);
            }
            
            return res.send('ok');
        });
    });
};

exports.queryMyOrders = function(req, res) {
    var q = {
        order_user : req.session.user.name
    };
    order.queryByCondiction(q, function(err, orders){ 
        if (err){
            return res.redirect('/');
        }

        var retJson = {};
        retJson["total"] = orders.length;
        retJson["data"] = new Array; 
        for(var i = 0; i < orders.length; ++i) {
            var o = {
                oid : orders[i].order_id,
                f : orders[i].courts_list,
                s : StatusMap[orders[i].status],
                p : orders[i].total_price  
            };
            retJson["data"].push(o);

        }
        res.send(retJson);
    });
}

exports.cancel = function(req, res) {
    var q = {
        order_user : req.session.user.name,
        order_id : req.query.id
    };
    
    order.cancel(req.session.user.name, req.query.id, function(err, num) {
        return exports.queryMyOrders(req, res);
    });
        /*
    order.queryByCondiction(q, function(err, orders) {
        if (orders == 0) {
            return exports.queryMyOrders(req, res);
        }
        court.cancel(req.session.user.name, orders[0].courts_list.split(','), function(err) {
            if (err) {
                console.log(err);
                return exports.queryMyOrders(req, res);
            }
            });

        });
            */

}

exports.book = function(req, res) {
    if (!req.body.urlParm || req.body.urlParm.length == 0) {
        r["staus"] = "405";
        r.msg = "非法订单,预定失败";
    }
    var r = {};

    console.log(req.body);
    mvenue.query(req.params['venueId'], function(err, venueInfo) {
        if (err) {
            r["staus"] = "404";
            r.msg = "预定场馆不存在";
        }
        order.newOrder(req.session.user.name, venueInfo, req.body.urlParm, function(err, results) {
            if (err) {
                r["staus"] = "403";
                r.msg = "预定发生冲突\n请重新预定";
                console.log(err);
                return res.send(r);
            }
            else {
                r["status"] = "200";
                r["url"] = "www.alipay/" + results;//o.OrderId.toString();
                return res.send(r);
            }
        });
    });
}
