var keystone = require('keystone'),
	Meetup = keystone.list('Meetup');

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


	// Count all subscribers

	view.on('init', function(next) {
		keystone.list('User').model.where('notifications.meetups', true).model.count(function(err, count) {
			locals.subscribersCount = count;
			next();
		});
	});

	
	// Get the next meetup

	view.on('init', function(next) {
		Meetup.model.findOne()
			.where('state', 'active')
			.sort('-date')
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

	
	// Notify subscribers

	view.on('post', { action: 'notify.subscribers' }, function(next) {
		if (!locals.nextMeetup) {
			req.flash('warning', 'There isn\'t a "next" meetup at the moment' );
			return next();
		} else {
			locals.nextMeetup.notifySubscribers(req, res, function(err) {
				if (err) {
					console.error("===== Failed to send meetup notification emails =====");
					console.error(err);
				} else {
					req.flash('success', 'Sent to ' + locals.subscribersCount + ' members.');
				}
				next();
			});
		}
	});

	
	// Populate the RSVPs for counting

	view.on('render', function(next) {
		if (locals.nextMeetup) {
			locals.nextMeetup.populateRelated('rsvps[who]', next);
		} else {
			next();
		}
		
	});
	
	view.render('tools/notification-center');
	
}
