var mongoose = require('mongoose');
var mongooseValidate = require('mongoose-validate');

var Schema = mongoose.Schema;
var ReviewSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId, 
		ref: 'User'
	},
	postedOn: {
		type: Date,
		default: Date.now
	},
	rating: {
		type: Number,
		required: true,
		min: [1, 'Too low'],
        max: [5, 'Too high']
	},
	review: {
		type: String,
	}
});

var Review = mongoose.model('Review',ReviewSchema);
module.exports = Review;