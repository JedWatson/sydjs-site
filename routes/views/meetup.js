var keystone = require('keystone'),
	moment = require('moment');

var Meetup = keystone.list('Meetup');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'meetups';

	view.query('meetup',
		Meetup.model.findOne()
			.where('key', req.params.meetup)
	, 'talks[who]');
	
	view.render('site/meetup');
	
}
