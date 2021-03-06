var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    stampNr: {
        type: String,
        default: ''
    },
    fullName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    facebookId: String,
    admin: {
        type: Boolean,
        default: false
    }
});

//automatically enables storing of username and password(also hashes password)
User.plugin(passportLocalMongoose);


//gets imported by authenticate.js
module.exports = mongoose.model('User', User);