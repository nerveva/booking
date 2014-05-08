var court = require('../models/court.js');

exports.init = function(req, res){
    court.init(req.query.num, req.query.date, function(err){
        if (err){
            res.send("init falied");
        }
    });
};
