var crypto = require('crypto'),
    User = require('../models/user.js');

exports.login = function(req, res){
    res.render('login');
};

exports.doLogin = function(req, res) {
    console.log('0')
    //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');
    console.log('1')

    User.get(req.body.username, function(err, user) {
        console.log('2')
        console.log(user)
        if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('/');
        }
        if (user.password != password) {
            req.flash('error', '密码错误');
            return res.redirect('/');
        }
        req.session.user = user;
        req.flash('success', '登录成功');
        res.redirect('/');
    });
};

exports.logout = function(req, res) {
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');
};
