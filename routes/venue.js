mvenue = require('../models/venue.js');

exports.showNewVenue = function(req, res) {
    res.render('reg_venue');
}

exports.regVenue = function(req, res) {
    
    var v = {
        venue_name : req.body.vname,
        venue_user : req.session.user.name,
        court_list : req.body.clist,
        start_time :parseInt(req.body.stime),
        end_time : parseInt(req.body.etime),
        price_policy : req.body.price,
        brief_intro : req.body.bintro,
        introduction : req.body.intro,
        status : 1 // normal
    };

    // TODO check vname

    mvenue.newVenue(v, function(err) {
        if (err) {
            console.log(err);
            res.send(err);
            return;
        }
        res.send('ok');
    });

}

exports.getVenues = function(req, res) {
    mvenue.queryAll(function(err, results) {
        var ret = {};
        if (err) {
            ret[s] = 401
            return res.send(ret);
        }
        ret["total"] = results.length;
        ret["data"] = new Array;
        for(var i = 0; i < results.length; ++i) {
            var v = {
                n : results[i].venue_name,
                img : "xxx.jpg",
                i : results[i].brief_intro,
                vid : results[i].venue_id,
                p : results[i].price_policy
            }; 
            ret["data"].push(v);
        }
        ret["s"] = 200;

        return res.send(ret);
    });
}
