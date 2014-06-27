var keystone = require('keystone'),
	moment = require('moment'),
	async = require('async');

exports = module.exports = function(done) {
	
	keystone.list('Meetup').model.find().exec(function(err, meetups) {
		async.each(meetups, function(meetup, doneMeetup) {
			console.log(meetup.date);
			meetup.set({
				startDate: moment(meetup.date).startOf('day').add('hours', 18).toDate(),
				endDate: moment(meetup.date).startOf('day').add('hours', 21).toDate()
			}).save(function(err) {
				return doneMeetup();
			});
		}, function(err) {
			return done();
		});
	});
	
};

exports.__defer__ = false;
