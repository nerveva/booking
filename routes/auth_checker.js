exports.loginReturn = function(req, res, next) {
    if (req.session.user) {
        res.redirect('/');
    }
    else {
        next();
    }
}

exports.loginNext = function(req, res, next) {
    if (req.session.user) {
        next();
    }
    else {
        res.redirect('/');
    }
}

exports.adminCheck = function(req, res, next) {
    if (req.session.user) {
        next();
    }
    else {
        res.redirect('/');
    }
}
