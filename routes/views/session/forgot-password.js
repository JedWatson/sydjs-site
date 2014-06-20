var keystone = require('keystone'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	view.on('post', { action: 'forgot-password' }, function(next) {
		
		if (!req.body.email) {
			req.flash('error', "Please enter an email address.");
			return next();
		}

		User.model.findOne().where('email', req.body.email).exec(function(err, user) {
			if (err) return next(err);
			if (!user) {
				req.flash('error', "Sorry, we don't recognise that email address.");
				return next();
			}
			user.resetPassword(function(err) {
				// if (err) return next(err);
				if (err) {
					console.error('===== ERROR sending reset password email =====');
					console.error(err);
					req.flash('error', 'Error sending reset password email. Please <a href="https://github.com/JedWatson/sydjs-site/issues" class="alert-link">let&nbsp;us&nbsp;know</a> about this error');
					next();
				} else {
					req.flash('success', 'We have emailed you a link to reset your password');
					res.redirect('/signin');
				}
			});
		});
		
	});
	
	view.render('session/forgot-password');
	
}
