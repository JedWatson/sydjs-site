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
			.sort('-startDate')
	, 'talks[who]');
	
	view.query('meetups.past',
		Meetup.model.find()
			.where('date').lt(moment().subtract('days', 1).endOf('day').toDate())
			.where('state', 'published')
			.sort('-startDate')
	, 'talks[who]');
	
	view.render('site/me');
	
}
