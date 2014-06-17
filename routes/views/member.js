var keystone = require('keystone'),
	moment = require('moment');

var User = keystone.list('User');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'members';
	locals.moment = moment;

	view.query('member', User.model.findOne()
		.where('key', req.params.member)
		.where('isPublic', true),
	'posts talks[meetup]');
	
	view.render('site/member');

}
