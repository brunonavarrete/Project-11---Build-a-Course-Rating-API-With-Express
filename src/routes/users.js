var express = require('express'),
	router = express.Router(),
	User = require('../models/user'),
	auth = require('basic-auth'),
	block = require('../middleware').blockUnauthorized;

// GET
	router.get('/', block, function(req,res,next){
		var credentials = auth(req);
		User.findOne({emailAddress:credentials.name})
		.exec(function(err,user){
			if(err) return next(err);
			res.send(user);
		});
	});

// POST
	router.post('/',function(req,res,next){
		var newUser = new User(req.body);
		newUser.save(function(err){
			if(err){ 
				err.status = 400;
				return next(err);
			}
			res.status(204);
			res.header('Location','/');
			next();
		});
	});

module.exports = router;