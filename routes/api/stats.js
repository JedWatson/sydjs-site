var async = require('async'),
	keystone = require('keystone');

var Meetup = keystone.list('Meetup'),
	RSVP = keystone.list('RSVP'),
	User = keystone.list('User'),
	Post = keystone.list('Post');

exports = module.exports = function(req, res) {

	var stats = {};
	
	async.parallel([
	
		function(next) {
			
			Meetup.model.findOne()
				.where('date').gte(moment().startOf('day').toDate())
				.where('state', 'published')
				.sort('date')
				.exec(function(err, meetup) {
				
					RSVP.model.count({
						meetup: meetup,
						attending: true
					})
					.exec(function(err, count) {
						stats.rsvps = count;
						return next();
					});
				
				});
		
		},
		
		function(next) {
			
			User.model.count()
				.exec(function(err, count) {
					stats.members = count;
					return next();
				});
		
		},
		
		function(next) {
			
			Post.model.count()
				.exec(function(err, count) {
					stats.posts = count;
					return next();
				});
		
		}
	
	], function(err) {
	
		return res.apiResponse(stats);
	
	});

}
