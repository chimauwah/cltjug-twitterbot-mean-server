// create index of all models definied in system
// whoever wants to add and get a list of all models, just refer to this index 
module.exports = {
	tweetqueue: require('./TweetQueue.js'),
	tweetreview: require('./TweetReview.js'),
	configs: require('./Configs.js'),
	user: require('./user.js'),
	authorizedusers: require('./AuthorizedUsers.js')
}