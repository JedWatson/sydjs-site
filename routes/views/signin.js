var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'session';
	
	view.on('post', function(next) {
		
		if (!req.body.email || !req.body.password) {
			req.flash('error', 'Please enter your username and password.');
			return next();
		}
		
		var onSuccess = function(user) {
			if (req.query && req.query.from) {
				res.redirect(req.query.from);
			} else {
				res.redirect('/me');
			}
		}
		
		var onFail = function(e) {
			req.flash('error', 'Your username or password were incorrect, please try again.');
			next();
		}
		
		keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);
		
	});
	
	view.render('site/signin');
	
}
