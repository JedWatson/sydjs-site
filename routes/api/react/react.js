var _ = require('underscore');
var async = require('async');
var keystone = require('keystone');
var Meetup = keystone.list('Meetup');
var RSVP = keystone.list('RSVP');

exports = module.exports = function(req, res) {

	var rtn = {
		meetups: {},
		people: [],
		rsvpStatus: {}
	};

	async.series([

		function(next) {
			keystone.list('Meetup').model.findOne()
				.where('startDate')
				.sort('-startDate')
				.exec(function(err, meetup) {
					if (err) {
						console.log('WTF: ', err)
					}
					rtn.meetups.last = meetup;
					return next();
				});
		},

		function(next) {
			keystone.list('RSVP').model.findOne()
				// .where('who', req.user._id)
				.where('meetup', rtn.meetups.last)
				.exec(function(err, rsvp) {
					if (err) {
						return console.log('Fucked out')
					}
					rsvpStatus = {
						rsvped: rsvp ? true : false,
						attending: rsvp && rsvp.attending ? true : false
					}
					console.log('working yeah?')
					return next();
				});
		},

		function(next) {
			keystone.list('RSVP').model.find()
				.where('meetup', rtn.meetups.last)
				.populate('who')
				.exec(function(err, results) {
					if (err) {
						console.log('WTF: ', err);
						return next(err);
					}
					rtn.people = _.compact(results.map(function(rsvp) {
						if (!rsvp.attending || !rsvp.who) return;
						return {
							attending: rsvp.attending,
							url: rsvp.who.isPublic ? rsvp.who.url : false,
							photo: rsvp.who.photo.exists ? rsvp.who._.photo.thumbnail(80,80) : '/images/avatar.png',
							name: rsvp.name
						};
					}));
					return next();
				});
		},

	], function(err) {

		if (err) {
			console.log('out of the series array error: ', err)
		}

		res.json(rtn);
	});
}
