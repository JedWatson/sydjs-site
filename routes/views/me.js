var keystone = require('keystone'),
	moment = require('moment');

var Meetup = keystone.list('Meetup'),
	RSVP = keystone.list('RSVP');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'me';
	
	view.query('meetups.next',
		Meetup.model.findOne()
			.where('date').gte(moment().startOf('day').toDate())
			.where('state', 'published')
			.sort('date')
	, 'talks[who]');
	
	view.query('rsvps.history',
		RSVP.model.find()
			.where('who', req.user)
			.where('attending', true)
			.populate('meetup')
			.sort('-createdAt')
	);
	
	view.on('post', { action: 'profile.top' }, function(next) {
	
		req.user.getUpdateHandler(req).process(req.body, {
			fields: 'name,email,twitter,website,github',
			flashErrors: true
		}, function(err) {
		
			if (err) {
				return next();
			}
			
			req.flash('success', 'Your changes have been saved.');
			return next();
		
		});
	
	});
	
	view.on('post', { action: 'profile.bottom' }, function(next) {
	
		req.user.getUpdateHandler(req).process(req.body, {
			fields: 'isPublic,bio,photo,mentoring.available,mentoring.free,mentoring.paid,mentoring.swap,mentoring.have,mentoring.want',
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
	
	view.on('render', function(next) {
		
		if (locals.meetups && locals.meetups.next) {
			RSVP.model.findOne().where('meetup', locals.meetups.next.id).where('who', req.user.id).exec(function(err, rsvp) {
				locals.meetups.nextRSVP = rsvp;
				next(err);
			});
		} else {
			next();
		}
		
	});
	
	view.render('site/me');
	
}
