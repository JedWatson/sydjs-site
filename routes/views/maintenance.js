var keystone = require('keystone'),
	moment = require('moment');

var Meetup = keystone.list('Meetup'),
	Post = keystone.list('Post');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	view.render('site/maintenance');
	
}
