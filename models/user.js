// load the things we need
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
// var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
// define properties for this object and what type of properties they are
var userSchema = mongoose.Schema({
    local: {
        email: String,
        hash: String,
        salt: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    }
});

userSchema.methods.setPassword = function(password){
  this.local.salt = crypto.randomBytes(16).toString('hex');
  this.local.hash = crypto.pbkdf2Sync(password, this.local.salt, 1000, 64, 'sha1').toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.local.salt, 1000, 64, 'sha1').toString('hex');
  return this.local.hash === hash;
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this.local._id,
    email: this.local.email,
    // name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

// // generating a hash
// userSchema.methods.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

// // checking if password is valid
// userSchema.methods.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.local.password);
// };

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
