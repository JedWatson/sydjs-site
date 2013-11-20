var keystone = require('keystone'),
	moment = require('moment');

var Meetup = keystone.list('Meetup');

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
	
	view.query('meetups.past',
		Meetup.model.find()
			.where('date').lt(moment().subtract('days', 1).endOf('day').toDate())
			.where('state', 'published')
			.sort('-date')
	, 'talks[who]');
	
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
			fields: 'isPublic,bio,mentoring.available,mentoring.free,mentoring.paid,mentoring.swap,mentoring.have,mentoring.want',
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
