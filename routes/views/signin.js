var async = require('async');

var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	if (req.user) {
		return res.redirect('/me');
	}
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'session';
	locals.form = req.body;
	
	view.on('post', { action: 'signin' }, function(next) {
		
		if (!req.body.signin_email || !req.body.signin_password) {
			req.flash('error', 'Please enter your username and password.');
			return next();
		}
		
		var onSuccess = function() {
			if (req.query && req.query.from) {
				res.redirect(req.query.from);
			} else {
				res.redirect('/me');
			}
		}
		
		var onFail = function() {
			req.flash('error', 'Your username or password were incorrect, please try again.');
			return next();
		}
		
		keystone.session.signin({ email: req.body.signin_email, password: req.body.signin_password }, req, res, onSuccess, onFail);
		
	});
	
	view.on('post', { action: 'join' }, function(next) {
		
		async.series([
			
			function(cb) {
				
				if (!req.body.join_name || !req.body.join_email || !req.body.join_password) {
					req.flash('error', 'Please enter a name, email and password.');
					return cb(true);
				}
				
				if (req.body.join_password != req.body.join_passwordConfirm) {
					req.flash('error', 'Passwords must match.');
					return cb(true);
				}
				
				return cb();
				
			},
			
			function(cb) {
				
				keystone.list('User').model.findOne({ email: req.body.join_email }, function(err, user) {
					
					if (err || user) {
						req.flash('error', 'User already exists with that email address.');
						return cb(true);
					}
					
					return cb();
					
				});
				
			},
			
			function(cb) {
			
				var splitName = req.body.join_name.split(' '),
					firstName = splitName[0],
					lastName = splitName[1];
				
				var userData = {
					name: {
						first: firstName,
						last: lastName
					},
					email: req.body.join_email,
					password: req.body.join_password,
					
					twitter: req.body.join_twitter
				};
				
				var User = keystone.list('User').model,
					newUser = new User(userData);
				
				newUser.save(function(err) {
					return cb(err);
				});
			
			}
			
		], function(err){
			
			if (err) return next();
			
			var onSuccess = function() {
				return res.redirect('/me');
			}
			
			var onFail = function(e) {
				req.flash('error', 'There was a problem signing you in, please try again.');
				return next();
			}
			
			keystone.session.signin({ email: req.body.join_email, password: req.body.join_password }, req, res, onSuccess, onFail);
			
		});
		
	});
	
	view.render('site/signin');
	
}
