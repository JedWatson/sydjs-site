var keystone = require('keystone'),
	moment = require('moment');

var Meetup = keystone.list('Meetup'),
	Post = keystone.list('Post');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'home';
	
	// Load the next meetup
	view.query('nextMeetup',
		Meetup.model.findOne()
			.where('date').gte(moment().startOf('day').toDate())
			.where('state', 'published')
			.sort('date')
	, 'talks[who]');
	
	// Load the last meetup
	view.query('lastMeetup',
		Meetup.model.findOne()
			.where('date').lt(moment().startOf('day').toDate())
			.where('state', 'published')
			.sort('-date')
	, 'talks[who]');
	
	// Load recent posts
	view.query('posts',
		Post.model.find()
			.where('state', 'published')
			.sort('-publishedDate')
			.limit(2)
			.populate('author categories'));
	
	view.render('site/index');
	
}
