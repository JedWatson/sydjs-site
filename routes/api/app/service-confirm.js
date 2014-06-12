var keystone = require('keystone'),
	async = require('async'),
	request = require('request'),
	_ = require('underscore'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {
	
	var locals = {
		authUser: req.body.authUser,
		form: req.body.form,
		
		existingUser: false
	}
	
	// Function to handle signin
	var doSignIn = function() {
	
		console.log('[api.app.service-confirm]  - Signing in user...');
		console.log('------------------------------------------------------------');
		
		var onSuccess = function(user) {
			console.log('[api.app.service-confirm]  - Successfully signed in.');
			console.log('------------------------------------------------------------');
			return res.apiResponse({
				success: true,
				session: true,
				date: new Date().getTime(),
				userId: user.id
			});
		}
		
		var onFail = function(err) {
			console.log('[api.app.service-confirm]  - Failed signing in.', err);
			console.log('------------------------------------------------------------');
			return res.apiResponse({
				success: false,
				session: false
			});
		}
		
		keystone.session.signin(String(locals.existingUser._id), req, res, onSuccess, onFail);
	
	}
	
	// Function to handle data confirmation process
	async.series([
		
		// Check for user by profile id (only if not signed in)
		function(next) {
			
			if (locals.existingUser) return next();
			
			console.log('[api.app.service-confirm]  - Searching for existing users via [' + locals.authUser.type + '] profile id...');
			console.log('------------------------------------------------------------');
			
			var query = User.model.findOne();
				query.where('services.' + locals.authUser.type + '.profileId', locals.authUser.profileId);
				query.exec(function(err, user) {
					if (err) {
						console.log('[api.app.service-confirm]  - Error finding existing user via profile id.', err);
						console.log('------------------------------------------------------------');
						return next(err);
					}
					if (user) {
						console.log('[api.app.service-confirm]  - Found existing user via [' + locals.authUser.type + '] profile id...');
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
			
			console.log('[api.app.service-confirm]  - Searching for existing users via [' + locals.authUser.email + '] email address...');
			console.log('------------------------------------------------------------');
			
			var query = User.model.findOne();
				query.where('email', locals.form.email);
				query.exec(function(err, user) {
					if (err) {
						console.log('[api.app.service-confirm]  - Error finding existing user via email.', err);
						console.log('------------------------------------------------------------');
						return next(err);
					}
					if (user) {
						console.log('[api.app.service-confirm]  - Found existing user via email address...');
						console.log('------------------------------------------------------------');
						locals.existingUser = user;
					}
					return next();
				});
		
		},
		
		// Create or update user
		function(next) {
		
			if (locals.existingUser) {
			
				console.log('[api.app.service-confirm]  - Existing user found, updating...');
				console.log('------------------------------------------------------------');
				
				var userData = {
					state: 'enabled',
					
					website: locals.form.website,
					
					isVerified: true,
					
					services: locals.existingUser.services || {}
				};
				
				_.extend(userData.services[locals.authUser.type], {
					isConfigured: true,
					
					profileId: locals.authUser.profileId,
					
					username: locals.authUser.username,
					accessToken: locals.authUser.accessToken,
					refreshToken: locals.authUser.refreshToken
				});
				
				// console.log('[api.app.service-confirm]  - Existing user data:', userData);
				
				locals.existingUser.set(userData);
				
				locals.existingUser.save(function(err) {
					if (err) {
						console.log('[api.app.service-confirm]  - Error saving existing user.', err);
						console.log('------------------------------------------------------------');
						return next(err);
					}
					console.log('[api.app.service-confirm]  - Saved existing user.');
					console.log('------------------------------------------------------------');
					return next();
				});
			
			} else {
			
				console.log('[api.app.service-confirm]  - Creating new user...');
				console.log('------------------------------------------------------------');
				
				var userData = {
					name: {
						first: locals.form['name.first'],
						last: locals.form['name.last']
					},
					email: locals.form.email,
					password: Math.random().toString(36).slice(-8),
					
					state: 'enabled',
					
					website: locals.form.website,
					
					isVerified: true,
					
					services: {}
				};
				
				userData.services[locals.authUser.type] = {
					isConfigured: true,
					
					profileId: locals.authUser.profileId,
					
					username: locals.authUser.username,
					accessToken: locals.authUser.accessToken,
					refreshToken: locals.authUser.refreshToken
				}
				
				// console.log('[api.app.service-confirm]  - New user data:', userData );
				
				locals.existingUser = new User.model(userData);
				
				locals.existingUser.save(function(err) {
					if (err) {
						console.log('[api.app.service-confirm]  - Error saving new user.', err);
						console.log('------------------------------------------------------------');
						return next(err);
					}
					console.log('[api.app.service-confirm]  - Saved new user.');
					console.log('------------------------------------------------------------');
					return next();
				});
				
			}
		
		},
		
		// Session
		function() {
			if (req.user) {
				console.log('[api.app.service-confirm]  - Already signed in, skipping sign in.');
				console.log('------------------------------------------------------------');
				return res.apiResponse({
					success: true,
					session: true,
					date: new Date().getTime(),
					userId: user.id
				});
			}
			return doSignIn();
		}
	
	], function(err) {
		if (err) {
			console.log('[api.app.service-confirm]  - Issue signing user in.', err);
			console.log('------------------------------------------------------------');
			return res.apiResponse({
				success: false,
				session: false
			});
		}
	});

}
