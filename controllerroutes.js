// assigns a controller to a given route (path) in your app

module.exports = {
	'/tweetqueue' : require('./controllers/TweetQueueController'),
	'/tweetreview' : require('./controllers/TweetReviewController'),
	'/configs' : require('./controllers/ConfigsController'),
	'/users' : require('./controllers/UsersController'),
	'/authorizedusers' : require('./controllers/AuthorizedUsersController')
};