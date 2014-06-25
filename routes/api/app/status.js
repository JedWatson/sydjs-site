var keystone = require('keystone'),
	async = require('async'),
	_ = require('underscore'),
	moment = require('moment');

exports = module.exports = function(req, res) {
	
	var data = {};
	
	async.series([
		function(next) {
			if (!req.body.user) return next();
			keystone.list('User').model.findById(req.body.user).exec(function(err, user) {
				if (err || !user) return res.apiResponse({ success: false });
				data.user = user;
				return next();
			});
		},
		function(next) {
			keystone.list('Meetup').model.findOne()
				.where('date').gte(moment().startOf('day').toDate())
				.where('state', 'active')
				.sort('date')
				.exec(function(err, meetup) {
					data.meetup = meetup;
					return next();
				});
		},
		function(next) {
			keystone.list('Talk').model.find()
				.where('meetup', data.meetup)
				.populate('who')
				.sort('sortOrder')
				.exec(function(err, talks) {
					data.talks = talks;
					return next();
				});
		},
		function(next) {
			if (!req.body.user) return next();
			keystone.list('RSVP').model.findOne()
				.where('who', data.user)
				.where('meetup', data.meetup)
				.exec(function(err, rsvp) {
					data.rsvp = rsvp;
					return next();
				});
		}
	], function(err) {
		
		var response = {
			success: true,
			config: {
				versions: { 
					compatibility: process.env.APP_COMPATIBILITY_VERSION,
					production: process.env.APP_PRODUCTION_VERSION
				},
				killSwitch: false
			},
			meetup: false,
			user: false
		}
		
		var day = moment(data.meetup.date).format('YYYY-MM-DD');
		
		// TODO: Would really help if meetups had an actual time field
		var times = data.meetup.time.split('-');
		
		var startTime = data.meetup ? _.first(times).trim() : false,
			endTime = data.meetup ? _.last(times).trim() : false;
			
		var startDate = data.meetup ? moment(day + (startTime ? ' ' + startTime : ''), 'YYYY-MM-DD' + (startTime ? ' ha' : '')) : false,
			endDate = data.meetup ? moment(day + (endTime ? ' ' + endTime : ''), 'YYYY-MM-DD' + (endTime ? ' ha' : '')) : false;
		
		if (data.meetup && moment().isBefore(endDate)) {
			response.meetup = {
				id: data.meetup._id,
				
				name: data.meetup.name,
				
				starts: startDate.toDate(),
				ends: endDate.toDate(),
				
				place: data.meetup.place,
				
				description: keystone.utils.cropString(keystone.utils.htmlToText(data.meetup.description), 250, '...', true),
				
				ticketsAvailable: data.meetup.rsvpsAvailable,
				ticketsRemaining: data.meetup.remainingRSVPs,
				
				talks: data.talks,
				
				rsvped: data.rsvp ? true : false,
				attending: data.rsvp && data.rsvp.attending ? true : false,
			}
		}
		
		if (data.user) {
			response.user = {
				date: new Date().getTime(),
				userId: data.user.id,
				name: {
					first: data.user.name.first,
					last: data.user.name.last,
					full: data.user.name.full
				},
				email: data.user.email
			}
		}
		
		res.apiResponse(response);
		
	});
}
