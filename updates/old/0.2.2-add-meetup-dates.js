var keystone = require('keystone'),
	moment = require('moment'),
	async = require('async');

exports = module.exports = function(done) {
	
	keystone.list('Meetup').model.find().exec(function(err, meetups) {
		async.each(meetups, function(meetup, doneMeetup) {
			meetup.set({
				state: 'draft', // Date is in a corrupted state, throws validation errors unless we first set a default
				publishedDate: moment(meetup.date).subtract('days', 7).toDate() // Set 7 days before actual meetup date
			}).save(function(err) {
				return doneMeetup();
			});
		}, function(err) {
			return done();
		});
	});
	
};

exports.__defer__ = true;
