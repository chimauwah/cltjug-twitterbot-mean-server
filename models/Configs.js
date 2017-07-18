//models should be very thin. just defining schema for db

var mongoose = require('mongoose'); // gives us interface to mongodb and maps models directly to db

// create schema
// define properties for this object and what type of properties they are
var configsSchema = mongoose.Schema({
	EMAIL_SENDER: {
		type: String,
		required: true
	},	
	EMAIL_RECIPIENT: {
		type: String,
		required: true
	},
	EMAIL_ALERT_THRESHOLD: {
		type: Number,
		required: true
	},
	TEXT_ALERT_THRESHOLD: {
		type: Number,
		required: true
	},
	TWEET_FREQUENCY: {
		type: Number,
		required: true
	},
	MAX_TWEET_REVIEWS_EMAIL_THRESHOLD: {
		type: Number,
		required: true
	},
	MAX_TWEET_REVIEWS_TEXT_THRESHOLD: {
		type: Number,
		required: true
	},			
	LAST_EMAIL_ALERT_TSTAMP: {
		type: Date,
		required: false
	},
	LAST_TEXT_ALERT_TSTAMP: {
		type: Date,
		required: false
	}
});

configsSchema.set('collection','configs');

// export the model schema. whenever someone 'requires' this component, pass it back to them
module.exports = configsSchema;