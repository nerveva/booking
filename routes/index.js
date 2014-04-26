register = require('./register.js')
login = require('./login.js')
court = require('./court.js')
booking = require('./booking.js')

module.exports = function(app){
    app.get('/', index);
    app.get('/reg', register.show);
    app.post('/reg', register.reg);
    app.get('/login', login.login);
    app.post('/login', login.doLogin);
    app.get('/logout', login.logout);
    app.get('/initcourt', court.init);
    app.get('/initvenue', booking.initVenue);
    app.get('/book', booking.show);
    app.get('/myorders', booking.queryMyOrders);
    app.get('/venue/:venueId', booking.query);
    app.post('/venue/:venueId', booking.book);
    app.get('/cancel', booking.cancel);
};



index = function(req, res){
  res.render('index', { title: 'Express' });
};
