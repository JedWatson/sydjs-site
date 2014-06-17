var keystone = require('keystone'),
	moment = require('moment');

var Meetup = keystone.list('Meetup'),
	RSVP = keystone.list('RSVP');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'me';
	locals.page.title = 'Settings - SydJS';
	
	view.query('nextMeetup',
		Meetup.model.findOne()
			.where('state', 'active')
			.sort('date')
	, 'talks[who]');
	
	view.query('rsvps.history',
		RSVP.model.find()
			.where('who', req.user)
			.where('attending', true)
			.populate('meetup')
			.sort('-createdAt')
	);
	
	view.on('post', { action: 'profile.details' }, function(next) {
	
		req.user.getUpdateHandler(req).process(req.body, {
			fields: 'name, email, notifications.meetups, notifications.posts, website, isPublic, bio, photo, mentoring.available, mentoring.free, mentoring.paid, mentoring.swap, mentoring.have, mentoring.want',
			flashErrors: true
		}, function(err) {
		
			if (err) {
				return next();
			}
			
			req.flash('success', 'Your changes have been saved.');
			return next();
		
		});
	
	});
	
	view.on('post', { action: 'profile.password' }, function(next) {
	
		if (!req.body.password || !req.body.password_confirm) {
			req.flash('error', 'Please enter a password.');
			return next();
		}
	
		req.user.getUpdateHandler(req).process(req.body, {
			fields: 'password',
			flashErrors: true
		}, function(err) {
		
			if (err) {
				return next();
			}
			
			req.flash('success', 'Your changes have been saved.');
			return next();
		
		});
	
	});
	
	view.render('site/me');
	
}
