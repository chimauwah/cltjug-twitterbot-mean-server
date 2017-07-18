// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {
    'twitterAuth': {
        'consumerKey': 'px7HDsxydajDY8UPHh8KKUt3W',
        'consumerSecret': 'ZIngDBZOLzLPr5Ytcw6yzIzfG5Ls3uDBitPLeZf6ERoSMSATT8',
        'callbackURL': 'http://localhost:3000/auth/twitter/callback',
        'accessToken':  '836943830809260032-CFh4h44E8z2VJd4A0NxGsgFt53s56F3',
  		'accessTokenSecret':'G7yo290270iEDUAwWsyXbvmVjiGNKGo3rWWFBeuc0KRIo'
        // 'userProfileURL': 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true'
    }
};
