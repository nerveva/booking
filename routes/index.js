
/*
 * GET home page.
 */

//module=require('module')
//module.exports = function(app) {
//  app.get('/', function (req, res) {
//    res.render('index', { title: 'Express' });
//  });
//};

//User = require('../modules/users.js')
//login = require('login')
register = require('./register.js')

module.exports = function(app){
    app.get('/', index);
    app.get('/reg', register.show);
    //app.post('/reg', register.reg);
    app.get('/', index);
    app.get('/', index);
    app.get('/', index);
    app.get('/', index);
    app.get('/', index);
};



index = function(req, res){
  res.render('index', { title: 'Express' });
};
