var restful = require('node-restful'); // takes a mongoose model (that we created) and converts it to rest API (builds all CRUD operations)

var userSchema = require('mongoose').model('User').schema;

module.exports = function(app, route) {

	// setup the controller for REST
	var rest = restful.model(
		'users',
		userSchema
		).methods(['get','put','post','delete']);

	// register this endpoint with the application
	rest.register(app, route);

	// return middleware so we can inject ourselves 
	return function(req, res, next) {
		next();
	};
};