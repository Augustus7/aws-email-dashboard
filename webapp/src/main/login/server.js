/* jshint laxcomma: true */

(function() {
  'use strict';


  var express =       require('express')
      , http =        require('http')
      , lessMiddleware = require('less-middleware')
      , passport =    require('passport')
      , path =        require('path')
      , User =        require('./server/models/User.js');

  var app = express();
  var bootstrapPath = path.join(__dirname, 'node_modules', 'bootstrap');

  // Configuration
  app.set('views', __dirname + '/client/views');
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.set('view engine', 'jade');
  app.use('/img', express.static(path.join(bootstrapPath, 'img')));

  app.use(lessMiddleware({
    src: path.join(__dirname, 'assets', 'less'),
    paths: [path.join(bootstrapPath, 'less')],
    dest: path.join(__dirname, 'client', 'stylesheets'),
    prefix: '/stylesheets'
  }));

  app.use(express.static(path.join(__dirname, 'client')));
  app.use(express.cookieSession(
      {
          secret: process.env.COOKIE_SECRET || "Superdupersecret"
      }));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(User.localStrategy);
  //passport.use(User.ldapStrategy());

  passport.serializeUser(User.serializeUser);
  passport.deserializeUser(User.deserializeUser);

  require('./server/routes.js')(app);

  app.set('port', process.env.PORT || 8000);
  http.createServer(app).listen(app.get('port'), function(){
      console.log("Express server listening on port " + app.get('port'));
  });
})();
