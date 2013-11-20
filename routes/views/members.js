var keystone = require('keystone');

var User = keystone.list('User');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'members';
	
	var membersQuery = User.model.find()
		.sort('name')
		.where('isPublic', true)
		.populate('organisation');
	
	if (req.params.filter == 'mentors') {
		membersQuery.where('mentoring.available', true);
	}
	
	view.query('members', membersQuery, 'posts talks[meetup]');
	
	if (req.params.filter == 'mentors') {
		view.render('site/mentors');
	} else {
		view.render('site/members');
	}
}
