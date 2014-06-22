var keystone = require('keystone'),
	async = require('async'),
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
			meetup: false,
			user: false
		}
		var from = data.meetup ? _.first(data.meetup.time.split('-')).trim() : false;
			date = data.meetup ? moment(data.meetup.date + (from ? ' ' + from : ''), 'YYYY-MM-DD' + (from ? ' ha' : '')) : false;
		if (data.meetup && moment().isBefore(date)) {
			response.meetup = {
				id: data.meetup._id,
				
				name: data.meetup.name,
				
				date: date.toDate(),
				
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
				email: data.user.email,
				services: {
					github: {},
					facebook: {},
					twitter: {},
					pushNotifications: data.user.services.pushNotifications
				}
			}
		}
		res.apiResponse(response);
	});
}
