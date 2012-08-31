var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , mongoose = require('mongoose')
  , LocalStrategy = require('passport-local').Strategy;
  
require('./public/javascripts/moment.js')

require('./models/user.js');
User = mongoose.model('User');

require('./models/game.js');
Game = mongoose.model('Game');

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  //console.log('passport deserialize findbyid');
  User.findById(id, function (err, user) {
    done(err, user);
  });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
    //process.nextTick(function () {
     
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      // findByUsername(username, function(err, user) {
      //   if (err) { return done(err); }
      //   if (!user) { return done(null, false, { message: 'Unkown user ' + username }); }
      //   if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
      //   return done(null, user);
      // })
      User.authenticate(username, password, function(err, user){
        console.log('Inside User.authenticate ' + err + ' ' + user)
        if(user==false)
          return done(err, user, { message: 'Invalid Password'});

        return done(err,user);
      });
        
   // });
  }
));
 
mongoose.connect('mongodb://commander:t0rpedo!@ds033607.mongolab.com:33607/subcommander');

var app = module.exports = express.createServer();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  
  app.use(express.logger({ format: ':date :remote-addr :method :status :url' }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var routes = require('./routes');
///TODO:
/*
add user access back in
user will login behind the scenes via username + access # (which is generated on create)
all requests will then have access to the user who is pushing/pulling data

*/
app.get('/load/:id',  routes.load);
app.get('/', routes.index);
app.get('/available/:id', routes.available);
app.get('/waiting/:id', routes.waiting);
app.get('/myavailablegames/:id', routes.myavailablegames);
app.get('/mywaitinggames/:id', routes.mywaitinggames);
app.post('/create/:id', routes.create);
app.post('/register', routes.registerPost)
app.post('/login', routes.loginPost);
app.get('/gamesWaitingUsers/:id', routes.gamesWaitingUsers);
app.post('/joinGame/:id', routes.joinGame);
app.post('/updateGame/:id', routes.updateGame);
app.post('/updateGameChange/:id', routes.updateGameChange)
app.get('/loginFailed', routes.loginFailed);
app.get('/loginSuccess',ensureAuthenticated, routes.loginSuccess);
app.post('/gameOver/:id', routes.gameOver);
app.get('/myStats/:id', routes.myStats);
app.post('/updateMyStats/:id', routes.updateMyStats);
app.get('/gameVersion', routes.gameVersion);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}


app.listen(8000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


