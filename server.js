// start up server run the application

// declare all the objects we need within this bootstrap

var express = require('express'); //pulling in module and assigning it to variable
// create the express application
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose'); // gives us interface to mongodb and maps models
var passport = require('passport');
var request = require('request'); // npm install request
var flash = require('connect-flash');

// var methodOverride = require('method-override');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var _ = require('lodash'); // typical thing to do is to assign lodash to  underscore variable name

var configDB = require('./config/database.js');

mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
// add middle ware necessary for REST APIs 
// intercepts itself into every request and provides unique to that plugin (ex. tell to use json, all http method)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended: true}));
// app.use(methodOverride('X-HTTP-Method-Override'));

app.set('view engine', 'ejs');

// CORS Support - allows us to expose our APIS to all URLs that are accessing our server (making us a public API)
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'If-Match, Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// required for passport
app.use(session({ 
	secret: 'blahblah', // session secret
	resave: true, 
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistend login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./routes')(app, passport, request); // load our routes and pass in our app and fully configured passport

mongoose.connection.on('open', function() {
	// Load the models and assign to app. This dependency injects all models into controllers
	app.models = require('./models/index')

	// load the routes (in this instance, the ones that are assigned a controller)
	var routes = require('./controllerroutes');

	// iterates over all the routes (paths) and assigns value (the controller) and key (the route) 
	// calling that controller and passing in app and route
	_.each(routes, function(controller, route) {
		app.use(route, controller(app, route));
	});

	// launch ======================================================================
	app.listen(port); 
	console.log('Listening on port '+port+ '...');

})


