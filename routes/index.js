register = require('./register.js')
login = require('./login.js')
court = require('./court.js')
booking = require('./booking.js')
venue = require('./venue.js')
auth_checker = require('./auth_checker.js')
admin = require('./admin.js')

module.exports = function(app){
    app.get('/', index);
    app.all('/reg', auth_checker.loginReturn);
    app.get('/reg', register.show);
    app.post('/reg', register.reg);

    app.all('/login', auth_checker.loginReturn);
    app.get('/login', login.login);
    app.post('/login', login.doLogin);

    app.get('/logout', login.logout);

    app.get('/regvenue', venue.showNewVenue);
    app.post('/regvenue', venue.regVenue);

    // user interface begin

    app.get('/venues', venue.getVenues);

    app.get('/book', booking.show);
    
    app.all('/venue', auth_checker.loginNext);
    app.get('/venue/:venueId/:datetime', booking.query);
    app.post('/venue/:venueId', booking.book);
    
    app.all('/myorders', auth_checker.loginNext);
    app.get('/myorders', booking.queryMyOrders);
    app.del('/myorders/:orderId', booking.cancel);


    // user interface end
    
    // admin interface begin
   
    //app.get('/login/admin', admin_user.showLogin);
    //app.post('/login/admin', admin_user.doLogin);

    app.all('/admin/', auth_checker.adminCheck);
    
    app.get('/admin/:venueId', admin.show);
    app.post('/admin/:venueId', admin.modifyVenue);
    app.get('/admin/:venueId/orders', admin.queryOrders);
    app.post('/admin/:venueId/order', admin.book);
    app.post('/admin/:venueId/orders/:orderId', admin.modifyOrder);
    
};



index = function(req, res){
  res.render('index', { title: 'Express' });
};
