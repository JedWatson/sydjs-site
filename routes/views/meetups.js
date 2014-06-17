var keystone = require('keystone'),
	moment = require('moment');

var Meetup = keystone.list('Meetup');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'meetups';
	
	view.query('upcomingMeetup',
		Meetup.model.findOne()
			.where('state', 'active')
			.sort('-date')
	, 'talks[who]');
	
	view.query('pastMeetups',
		Meetup.model.find()
			.where('state', 'past')
			.sort('-date')
	, 'talks[who]');
	
	view.render('site/meetups');
	
}
