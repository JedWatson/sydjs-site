var keystone = require('keystone'),
	async = require('async');

var Meetup = keystone.list('Meetup'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'tools';
	locals.nextMeetup = false;


	// Keep it secret, keep it safe

	if (!req.user || req.user && !req.user.isAdmin) {
		console.warn('===== ALERT =====');
		console.warn('===== A non-admin attempted to access the Notification Center =====');
		return res.redirect('/');
	}


	// Get all subscribers
	
	view.query('subscribers', User.model.find().where('notifications.meetups', true));

	
	// Get the next meetup

	view.on('init', function(next) {
		Meetup.model.findOne()
			.where('state', 'active')
			.sort('-startDate')
			.exec(function(err, meetup) {
			
				if (err) {
					console.error("===== Error loading next meetup =====");
					console.error(err);
					return next();
				} else if (!meetup) {
					req.flash('warning', 'There isn\'t a "next" meetup at the moment' );
					return next();
				} else {
					locals.nextMeetup = meetup;
					next();
				}

			});
	});

	
	// Notify next meetup attendees

	view.on('post', { action: 'notify.attendee' }, function(next) {
		if (!locals.nextMeetup) {
			req.flash('warning', 'There isn\'t a "next" meetup at the moment' );
			return next();
		} else {
			locals.nextMeetup.notifyAttendees(req, res, function(err) {
				if (err) {
					console.error("===== Failed to send meetup notification emails =====");
					console.error(err);
				} else {
					req.flash('success', 'Notification sent to ' + keystone.utils.plural(locals.nextMeetup.rsvps.length, '* attendee'));
				}
				next();
			});
		}
	});

	
	// Notify all SydJS subscribers

	view.on('post', { action: 'notify.subscriber' }, function(next) {
		if (!locals.subscribers) {
			req.flash('warning', 'There aren\'t any subscribers at the moment' );
			return next();
		} else {
			locals.subscribers.forEach(function(subscriber) {
				new keystone.Email('member-notification').send({
					subscriber: subscriber,
					subject: req.body.subscriber_email_subject || 'Notification from SydJS',
					content: req.body.subscriber_email_content,
					link_label: req.body.subscriber_email_link_label,
					link_url: req.body.subscriber_email_link_url,
					to: subscriber.email,
					from: {
						name: 'SydJS',
						email: 'hello@sydjs.com'
					}
				}, next);
				req.flash('success', 'Email sent to ' + keystone.utils.plural(locals.subscribers.length, '* subscriber'));
			});
		}
	});

	
	// Populate the RSVPs for counting

	view.on('render', function(next) {
		if (locals.nextMeetup) {
			locals.nextMeetup.populateRelated('rsvps', next);
		} else {
			next();
		}
		
	});
	
	view.render('tools/notification-center');
	
}
