var keystone = require('keystone'),
	async = require('async'),
	_ = require('underscore'),
	moment = require('moment');

exports = module.exports = function(req, res) {
	
	var data = { meetups: {} };
	
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
				.where('state', 'past')
				.sort('-startDate')
				.exec(function(err, meetup) {
					data.meetups.last = meetup;
					return next();
				});
		},
		function(next) {
			keystone.list('Meetup').model.findOne()
				.where('state', 'active')
				.sort('-startDate')
				.exec(function(err, meetup) {
					data.meetups.next = meetup;
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
			meetups: {
				last: false,
				next: false
			},
			user: false
		}
		
		var meetup = function(m, current) {
			return {
				id: m._id,
				
				name: m.name,
				
				starts: m.startDate,
				ends: m.endDate,
				
				place: m.place,
				
				description: keystone.utils.cropString(keystone.utils.htmlToText(m.description), 250, '...', true),
				
				ticketsAvailable: m.rsvpsAvailable,
				ticketsRemaining: m.remainingRSVPs,
				
				talks: m.talks,
				
				rsvped: current && data.rsvp ? true : false,
				attending: current && data.rsvp && data.rsvp.attending ? true : false
			}
		}
		
		if (data.meetups.last) {
			response.meetups.last = meetup(data.meetups.last);
		}
		
		if (data.meetups.next && moment().isBefore(data.meetups.next.endDate)) {
			response.meetups.next = meetup(data.meetups.next, true);
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
