var keystone = require('keystone'),
	moment = require('moment');

var User = keystone.list('User');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'members';
	locals.moment = moment;


	// Load the Member

	view.on('init', function(next) {
		User.model.findOne()
		.where('key', req.params.member)
		.exec(function(err, member) {
			if (err) return res.err(err);
			if (!member) {
				req.flash('info', 'Sorry, we couldn\'t find a matching member');
				return res.redirect('/members')
			}
			locals.member = member;
			next();
		});
	});

	
	// Set the page title and populate related documents
	
	view.on('render', function(next) {
		if (locals.member) {
			locals.page.title = locals.member.name.full + ' - SydJS';
			locals.member.populateRelated('posts talks[meetup]', next);
		}
	});
	
	view.render('site/member');

}
