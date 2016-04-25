var mongoose = require('mongoose')
var ObjectId = require('mongodb').ObjectID;
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

var UserSchema = new Schema({
	 local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
   username:String,
   password:String,
   email:String,
   password:String,
   phone:Number,
   _enabled:Boolean,
   compendium: {type:mongoose.Schema.Types.ObjectId, ref: 'Compendium'}
});

// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


// create the model for users and expose it to our app
module.exports = mongoose.model('User', UserSchema);




module.exports = mongoose.model('users', UserSchema);  