var auth = require('basic-auth'),
	User = require('../models/user');

// Block unauthorized acces with myError
	function blockUnauthorized(req,res,next){
		var credentials = auth(req);
		if( !credentials ){
			var err = new Error();
			err.name = 'Unauthorized';
			err.message = 'Authentication failed';
			err.status = 401;
			return next(err);
		}
		User.authenticate(credentials.name,credentials.pass,function(err,user){
			if(err) return next(err);
			return next();
		});
	}

module.exports.blockUnauthorized = blockUnauthorized;