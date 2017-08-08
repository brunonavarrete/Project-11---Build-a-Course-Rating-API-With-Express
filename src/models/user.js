var mongoose = require('mongoose'),
	mongooseValidate = require('mongoose-validate'),
	bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
var UserSchema = new Schema({
	fullName: {
		type: String,
		required: true 
	},
	emailAddress: {
		type: String,
		required: true,
		unique: true,
		validate: [mongooseValidate.email, 'invalid email address']
	},
	password: {
		type: String,
		required: true
	}
});

UserSchema.statics.authenticate = function(email,password,callback){
	User.findOne({emailAddress:email})
	.exec(function(err,user){
		if(!user || err){
			var err = new Error('Authentication failed');
			err.status = 401;
			return next(err);
		} else {
			bcrypt.compare(password,user.password,function(err,result){
				if( result === true ){
					return callback(null,user);
				} else {
					return callback();
				}
			});
		}
	});
}

UserSchema.pre('save',function(next){
	var user = this;
	bcrypt.hash(user.password,10,function(err,hash){
		if(err) return next(err);
		user.password = hash;
		next();
	});
});

var User = mongoose.model('User',UserSchema);
module.exports = User;