var Twit = require('twit');

// load the auth variables
var configAuth = require('./config/auth');

module.exports = function(app, passport, request) {

    var T = new Twit({
        consumer_key: configAuth.twitterAuth.consumerKey,
        consumer_secret: configAuth.twitterAuth.consumerSecret,
        access_token: configAuth.twitterAuth.accessToken,
        access_token_secret: configAuth.twitterAuth.accessTokenSecret
    })

    app.post('/sendtweet', function(req, res, next) {
        console.log('sendtweetnow called!');
        T.post('statuses/update', {
            status: req.param('message')
        }, function(err, data, response) {
            if(err) {
                return next(err)
            }
            console.log('sent tweet: ' +data.text);
            res.status(200);
            res.json({
                'success': true
            });
        });
        (req, res, next);
    });

    app.post('/retweet', function(req, res, next) {
        console.log('retweetnow called!');
        T.post('statuses/retweet/:id', {
            id: req.param('tweetid')
        }, function(err, data, response) {
            if(err) {
                return next(err)
            }
            console.log('sent retweet: ' +data);
            res.status(200);
            res.json({
                'success': true
            });
        });
        (req, res, next);        
    });    

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

// locally --------------------------------

    // process the login form
    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            console.log('err: ' + err);
            console.log('user: ' + user);
            info = JSON.stringify(info);
            console.log('Info: '+ info);
            for(var key in info) {
                console.log(key);
            } 
            if(err) {
                // res.status(404).json(err); return;
                return next(err)
            }
            if(!user) {
                return res.json({
                    'success': false,
                    'msg': req.flash('loginMessage')[0]                        
                });
            }                
            token = user.generateJwt();
            res.status(200);
            res.json({
                'success': true,                        
                'token': token,
                'user': user.local.email,
                'msg': 'Congrats '+user.local.email+', you are now logged in.'
            });
        })
        (req, res, next);
    });


    // process the signup form
    app.post('/register', function(req, res, next) {    
        passport.authenticate('local-signup', function(err, user, info) {
            console.log('err: ' + err);
            console.log('user: ' + user);
            info = JSON.stringify(info);
            console.log('Info: '+ info);
            for(var key in info) {
                console.log(key);
            }
            if(err) {
                return next(err)
            }
            if (!user) {
                return res.json({ 
                    'success': false,
                    'msg': req.flash('signupMessage')[0]                        
                });
            }                
            token = user.generateJwt();
            res.status(201);
            res.json({
                'success': true,
                'token': token,
                'user': user.local.email,
                'msg': 'Congrats '+user.local.email+', you are now registered.'
            });
        })
        (req, res, next);
    });


// twitter --------------------------------
	// send to twitter to do the authentication
	app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback', function(req, res, next) {
        passport.authenticate('twitter', function(err, user, info) {
            console.log('err: ' + err);
            console.log('user: ' + user);
            info = JSON.stringify(info);
            console.log('Info: '+ info);
            for(var key in info) {
                console.log(key);
            }
            if(err) {
                return next(err)
            }
            res.status(200);
            res.json({
                'success': true,
                'token': user.twitter.token,
                'user': user.twitter.displayName,
                'msg': 'Congrats '+user.twitter.displayName+', you are now logged in.'
            });             

        })
        (req, res, next);
    });

	// // handle the callback after twitter has authenticated the user
	// app.get('/auth/twitter/callback',
	//     passport.authenticate('twitter', { 
 //            session: false,
 //            failureRedirect: '/'
 //            // successRedirect: '/account'
 //        }),
 //        function(req, res) {
 //            // res.status(200).json({
 //            //     user: req.user,
 //            //     token: req.user.twitter.token
 //            // });
 //            // console.log('req.body: ' + req.body);
 //            // console.log('token: ' + req.user.twitter.token);
 //            // console.log('request: ' + req.user.twitter);
 //            res.json({user:req.user});
 //            // res.redirect('http://localhost:9000/#!/approve-tweets');
 //        });


// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================
// twitter --------------------------------

    // send to twitter to do the authentication
    app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

    // handle the callback after twitter has authorized the user
    app.get('/connect/twitter/callback',
        passport.authorize('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
    // twitter --------------------------------
    app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
} 