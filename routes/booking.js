court = require('../models/court.js');
venue = require('../models/venue.js');


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

exports.book = function(req, res) {
    court.book(req.session.user, req.body.urlParm, function(err, results) {
        var r = {};
        if (err) {
            r["status"] = 400;
        }
        else {
            if (results.sucNum == req.body.urlParm.length) {
                r["status"] = 201;
                r["details"] = results.details;
            }
            else {
                r["status"] = 200;
            }
            r["url"] = "xx";
        }
        res.send(r);
    });
}
