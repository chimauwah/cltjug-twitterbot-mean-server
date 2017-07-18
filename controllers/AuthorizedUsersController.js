var restful = require('node-restful'); // takes a mongoose model (that we created) and converts it to rest API (builds all CRUD operations)

module.exports = function(app, route) {

	// setup the controller for REST
	var rest = restful.model(
		'authorizedusers',
		app.models.authorizedusers
		).methods(['get','put','post','delete']);

	// register this endpoint with the application
	rest.register(app, route);

	// return middleware so we can inject ourselves 
	return function(req, res, next) {
		next();
	};
};