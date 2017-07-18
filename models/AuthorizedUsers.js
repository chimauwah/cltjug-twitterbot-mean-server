//models should be very thin. just defining schema for db

var mongoose = require('mongoose'); // gives us interface to mongodb and maps models directly to db

// create schema
// define properties for this object and what type of properties they are
var authorizedUsersSchema = mongoose.Schema({
	email: {
		type: String,
		required: true
	}
});

authorizedUsersSchema.set('collection','athorizedUsers');

// export the model schema. whenever someone 'requires' this component, pass it back to them
module.exports = authorizedUsersSchema;