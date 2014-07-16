var keystone = require('keystone'),
	_ = require('underscore');

var User = keystone.list('User'),
	Organisation = keystone.list('Organisation');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'showbag';
	locals.page.title = 'SydJS Showbag';

	Organisation.model.findOne().where('key', 'thinkmill').exec(function(err, thinkmill) {
		if (err || !thinkmill) {
			return view.render('errors/500');
		}
		locals.thinkmill = thinkmill;

		view.query('members', User.model.find().where({organisation: thinkmill.id}));
		view.render('site/showbag');

	});
	
}
