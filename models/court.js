var crypto = require('crypto');
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/booking');

var cSchema = {
    id : String,
    date : String
};

for(var i = 8; i < 22; ++i){
    cSchema[i + "00"] = String;
}

var courtSchema = new mongoose.Schema(cSchema, {
    collection: 'courts'
});

var courtModel = mongoose.model('Court', courtSchema);

function Court()
{
};

Court.book = function(begin, end, date, callback){
    var q = {};
    var m = {};
    for(var i = parseInt(begin.replace(':', '')); i < parseInt(end.replace(':', '')); i += 100){
        q[i.toString()] = 0;
        m[i.toString()] = 1;
    };

    courtModel.findOneAndUpdate(q, m, function(err, court){
        if (err) {
            console.log(err);
            return callback(err);
        }
        callback(null, court);
    });
};

Court.query = function(tdate, callback){
    courtModel.find({date : tdate}, function(err, courts){
        if (err) {
            console.log(err);
            return callback(err);
        }
        callback(null, courts);
    });
};

exports.init = function(num, date, callback){
    for(var i = 0; i < num; ++i)
    {
        var court = {
            id : i,
            date : date
        };

        for(var j = 8; j < 22; ++j){
            court[j + "00"] = 0;
        };

        var newCourt = new courtModel(court);
        newCourt.save(function(err, court){
            if (err){
                console.log(err);
                return callback(err);
            }
        });
    };
    callback(null);
};

exports = Court;
