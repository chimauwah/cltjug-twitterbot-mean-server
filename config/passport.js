var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

var User = require('../models/user');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {
	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


   // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            console.log('looking for user: **' +email+'**');
            User.findOne({ 'local.email' : email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user) {
                    console.log(email + ': user not found');
                    return done(null, false, req.flash('loginMessage', 'Sorry, we can\'t find an account with this email address'));
                }

                if (!user.validPassword(password)) {
                    console.log(email + ': user entered incorrect password');
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }

                // all is well, return user
                else {
                    console.log('User found. Can log in: ' + email);
                    return done(null, user); 
                }
            });
        });

    }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the call back
    },
    function(req, email, password, done) {
        console.log('****************** registering email :'+email);
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err) {
                    console.log('****************** email & error :'+email + error);
                    return done(err);
                }

                // check to see if theres already a user with that email
                if (user) {
                    console.log('****************** email already exists: '+email);
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    // if there is no user with that email
                    // create the user
                    console.log('****************** no user with that email - create! ***************');
                    var newUser = new User();
                    
                    newUser.local.email = email;
                    newUser.setPassword(password);

                    newUser.save(function(err) {
                        if (err) {
                            console.log('****************** error creating new user ***************' + err);
                            return done(err);
                        }

                        return done(null, newUser);
                    });
                }

            });        

        });

    }));


    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({
        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, token, tokenSecret, profile, done) {
        // asynchronous
        process.nextTick(function() {
            // check if the user is already logged in
            if (!req.user) {
                User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.twitter.token) {
                            user.twitter.token       = token;
                            user.twitter.username    = profile.username;
                            user.twitter.displayName = profile.displayName;
                        
                            user.save(function(err) {
                                if (err)
                                    return done(err);
                                console.log('in passport.js - user already exists but no token - token: ' + user.twitter.token);                                    
                                return done(null, user);
                            });
                        }

                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser                 = new User();

                        newUser.twitter.id          = profile.id;
                        newUser.twitter.token       = token;
                        newUser.twitter.username    = profile.username;
                        newUser.twitter.displayName = profile.displayName;
                        console.log('**** ' + profile.username+' needed to be created *****');

                        newUser.save(function(err) {
                            if (err)
                                return done(err);
                            console.log('in passport.js - no user but created'); 
                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user                 = req.user; // pull the user out of the session

                user.twitter.id          = profile.id;
                user.twitter.token       = token;
                user.twitter.username    = profile.username;
                user.twitter.displayName = profile.displayName;

                user.save(function(err) {
                    if (err)
                        return done(err);
                    console.log('in passport.js - user already exists and is logged in - token: ' + user.twitter.token);
                    return done(null, user);
                });
            }

        });

    }));

}