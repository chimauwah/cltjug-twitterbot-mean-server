//models should be very thin. just defining schema for db

var mongoose = require('mongoose'); // gives us interface to mongodb and maps models directly to db

// create schema
// define properties for this object and what type of properties they are
var tweetQueueSchema = mongoose.Schema({
	tweetid: {
		type: String,
		required: false
	},	
	message: {
		type: String,
		required: true
	},
	countdown: {
		type: String,
		required: false
	},
	datetweeted: {
		type: Date,
		required: false
	},
	errormessage: {
		type: String,
		required: false
	}
});

tweetQueueSchema.set('collection','tweetqueue');

// export the model schema. whenever someone 'requires' this component, pass it back to them
module.exports = tweetQueueSchema;