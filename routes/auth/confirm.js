var keystone = require('keystone'),
	async = require('async'),
	request = require('request'),
	_ = require('underscore'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'profile';
	locals.form = req.body;
	locals.returnto = req.query.returnto;
	
	locals.authUser = req.session.auth;
	locals.existingUser = false;
	
	// Reject request if no auth data is stored in session
	if (!req.session.auth) {
		console.log('[auth.confirm] - No auth data detected, redirecting to signin.');
		console.log('------------------------------------------------------------');
		return res.redirect('/signin');
	}
	
	// Set existing user if already logged in
	if (req.user) {
		locals.existingUser = req.user;
	}
	
	// Function to handle signin
	var doSignIn = function() {
	
		console.log('[auth.confirm] - Signing in user...');
		console.log('------------------------------------------------------------');
		
		var onSuccess = function(user) {
			console.log('[auth.confirm] - Successfully signed in.');
			console.log('------------------------------------------------------------');
			return res.redirect('/me');
		}
		
		var onFail = function(err) {
			console.log('[auth.confirm] - Failed signing in.', err);
			console.log('------------------------------------------------------------');
			req.flash('error', 'Sorry, there was an issue signing you in, please try again.');
			return res.redirect('/signin');
		}
		
		keystone.session.signin(String(locals.existingUser._id), req, res, onSuccess, onFail);
	
	}
	
	// Function to handle data confirmation process
	var checkAuth = function() {
	
		async.series([
		
			// Check for user by profile id (only if not signed in)
			function(next) {
				
				if (locals.existingUser) return next();
				
				console.log('[auth.confirm] - Searching for existing users via [' + req.session.auth.type + '] profile id...');
				console.log('------------------------------------------------------------');
				
				var query = User.model.findOne();
					query.where('services.' + req.session.auth.type + '.profileId', req.session.auth.profileId);
					query.exec(function(err, user) {
						if (err) {
							console.log('[auth.confirm] - Error finding existing user via profile id.', err);
							console.log('------------------------------------------------------------');
							return next(err);
						}
						if (user) {
							console.log('[auth.confirm] - Found existing user via [' + req.session.auth.type + '] profile id...');
							console.log('------------------------------------------------------------');
							locals.existingUser = user;
							return doSignIn();
						}
						return next();
					});
			
			},
			
			// Check for user by email (only if not signed in)
			function(next) {
				
				if (locals.existingUser) return next();
				
				console.log('[auth.confirm] - Searching for existing users via [' + req.session.auth.email + '] email address...');
				console.log('------------------------------------------------------------');
				
				var query = User.model.findOne();
					query.where('email', req.body.email);
					query.exec(function(err, user) {
						if (err) {
							console.log('[auth.confirm] - Error finding existing user via email.', err);
							console.log('------------------------------------------------------------');
							return next(err);
						}
						if (user) {
							console.log('[auth.confirm] - Found existing user via email address...');
							console.log('------------------------------------------------------------');
							locals.existingUser = user;
						}
						return next();
					});
			
			},
			
			// Create or update user
			function(next) {
			
				if (locals.existingUser) {
				
					console.log('[auth.confirm] - Existing user found, updating...');
					console.log('------------------------------------------------------------');
					
					var userData = {
						state: 'enabled',
						
						website: req.body.website,
						
						isVerified: true,
						
						services: locals.existingUser.services || {}
					};
					
					_.extend(userData.services[req.session.auth.type], {
						isConfigured: true,
						
						profileId: req.session.auth.profileId,
						
						username: req.session.auth.username,
						accessToken: req.session.auth.accessToken,
						refreshToken: req.session.auth.refreshToken
					});
					
					// console.log('[auth.confirm] - Existing user data:', userData);
					
					locals.existingUser.set(userData);
					
					locals.existingUser.save(function(err) {
						if (err) {
							console.log('[auth.confirm] - Error saving existing user.', err);
							console.log('------------------------------------------------------------');
							return next(err);
						}
						console.log('[auth.confirm] - Saved existing user.');
						console.log('------------------------------------------------------------');
						return next();
					});
				
				} else {
				
					console.log('[auth.confirm] - Creating new user...');
					console.log('------------------------------------------------------------');
					
					var userData = {
						name: {
							first: req.body['name.first'],
							last: req.body['name.last']
						},
						email: req.body.email,
						password: Math.random().toString(36).slice(-8),
						
						state: 'enabled',
						
						website: req.body.website,
						
						isVerified: true,
						
						services: {}
					};
					
					userData.services[req.session.auth.type] = {
						isConfigured: true,
						
						profileId: req.session.auth.profileId,
						
						username: req.session.auth.username,
						accessToken: req.session.auth.accessToken,
						refreshToken: req.session.auth.refreshToken
					}
					
					// console.log('[auth.confirm] - New user data:', userData );
					
					locals.existingUser = new User.model(userData);
					
					locals.existingUser.save(function(err) {
						if (err) {
							console.log('[auth.confirm] - Error saving new user.', err);
							console.log('------------------------------------------------------------');
							return next(err);
						}
						console.log('[auth.confirm] - Saved new user.');
						console.log('------------------------------------------------------------');
						return next();
					});
					
				}
			
			},
			
			// Session
			function() {
				if (req.user) {
					console.log('[auth.confirm] - Already signed in, skipping sign in.');
					console.log('------------------------------------------------------------');
					return res.redirect('/me');
					return next();
				}
				return doSignIn();
			}
		
		], function(err) {
			if (err) {
				req.flash('error', 'Sorry, there was an issue signing you in, please try again.');
				return res.redirect('/signin');
			}
		});
	
	}
	
	// Retrieve additional data to assist registration (email)
	view.on('render', function(next) {
	
		if (req.session.auth.type != 'github') return next();
		
		console.log('[auth.confirm] - Finding GitHub email addresses...');
		console.log('------------------------------------------------------------');
		
		request({
			url: 'https://api.github.com/user/emails?access_token=' + req.session.auth.accessToken,
			headers: {
				'User-Agent': 'forums.keystonejs.com'
			}
		}, function(err, data) {
		
			if (err) {
				console.log(err);
				console.log('[auth.confirm] - Error retrieving GitHub email addresses.');
				console.log('------------------------------------------------------------');
				return next();
				
			} else {
				
				console.log('[auth.confirm] - Retrieved GitHub email addresses...');
				console.log('------------------------------------------------------------');
				
				var emails = JSON.parse(data.body);
				
				if (emails.length) {
					_.each(emails, function(e) {
						if (!e.primary) return;
						req.session.auth.email = e.email;
						return next();
					});
				} else {
					return next();
				}
				
			}
			
		});
	
	});
	
	view.on('init', function(next) {
		if (req.user) return checkAuth();
		return next();
	});
	
	view.on('post', { action: 'confirm.details' }, function(next) {
		if (!req.body['name.first'] || !req.body['name.last'] || !req.body.email) {
			req.flash('error', 'Please enter a name & email.');
			return next();
		}
		return checkAuth();
	});
	
	view.render('auth/confirm');
	
}
