var express = require('express'),
	router = express.Router(),
	Course = require('../models/course'),
	Review = require('../models/review'),
	block = require('../middleware').blockUnauthorized;

// GET
	router.get('/',function(req,res,next){
		Course.find({},{title:true})
		.exec(function(err,courses){
			if(err) return next(err);
			res.send(courses);
		});
	});

	router.get('/:courseId',function(req,res,next){
		Course.findOne({_id:req.params.courseId})
		.populate(['user','reviews'])
		.exec(function(err,course){
			if(err) return next(err);
			res.send(course);
		});
	});

// POST
	router.post('/', block, function(req,res,next){
		if( req.body.title && req.body.description ){
			var newCourse = new Course(req.body);
			newCourse.save(function(err){
				if(err){ 
					err.status = 400;
					return next(err);
				}
				res.status(204);
				res.header('Location','/');
				next();
			});
		} else {
			var err = new Error('Title and description are required');
		  	err.status = 400;
		  	return next(err);
		}
	});

	router.post('/:courseId/reviews',function(req,res,next){
		if( req.body.rating ){
			Course.findOne({_id:req.params.courseId})
			.exec(function(err,course){
				if(err) return next(err);
				var newReview = new Review(req.body);
				newReview.save(function(err,review){
					if(err){ 
						err.status = 400;
						return next(err);
					}
					course.reviews.push(review._id);
					course.save(function(err){
						if(err){ 
							err.status = 400;
							return next(err);
						}
						res.header('Location','/courses/'+req.params.courseId);
						next();
					});
				});
			});
		} else {
			var err = new Error('Rating required');
		  	err.status = 400;
		  	return next(err);
		}
	});

// PUT
	router.put('/:courseId',function(req,res,next){
		Course.findOne({_id:req.params.courseId})
		.exec(function(err,course){
			if(err||!course){
				var err = new Error('Problem retreiving course, check a course with the _id of ' + req.params.courseId + ' exists in the database');
			  	err.status = 404;
			  	return next(err);
			}
			course.user = req.body.user;
			course.title = req.body.title;
			course.description = req.body.description;
			course.estimatedTime = req.body.estimatedTime;
			course.materialsNeeded = req.body.materialsNeeded;
			course.steps = req.body.steps;
			course.save(function(err){
				if(err){ 
					err.status = 400;
					return next(err);
				}
				res.status(204);
				res.header('Location','/');
				next();
			});
		});
	});

module.exports = router;