var keystone = require('keystone'),
	moment = require('moment'),
	Meetup = keystone.list('Meetup');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'meetups';
	locals.page.title = 'Meetups - SydJS';


	// LOAD the Meetup

	view.on('init', function(next) {
		Meetup.model.findOne()
			.where('key', req.params.meetup)
			.exec(function(err, meetup) {
				
				if (err) return res.err(err);
				if (!meetup) return res.notfound('Post not found');
				
				locals.meetup = meetup;
				locals.meetup.populateRelated('talks[who] rsvps[who]', next);

			});
	});
	
	view.render('site/meetup');
	
}
