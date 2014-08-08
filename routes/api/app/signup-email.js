var keystone = require('keystone'),
	async = require('async'),
	_ = require('underscore'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {
	
	var locals = {
		form: req.body,
		
		newUser: false
	}
	
	// Function to handle signin
	var doSignIn = function() {
	
		console.log('[api.app.signup]  - Signing in user...');
		console.log('------------------------------------------------------------');
		
		var onSuccess = function(user) {
			console.log('[api.app.signup]  - Successfully signed in.');
			console.log('------------------------------------------------------------');
			return res.apiResponse({
				success: true,
				session: true,
				date: new Date().getTime(),
				userId: user.id
			});
		}
		
		var onFail = function(err) {
			console.log('[api.app.signup]  - Failed signing in.', err);
			console.log('------------------------------------------------------------');
			return res.apiResponse({
				success: false,
				session: false,
				message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
			});
		}
		
		keystone.session.signin(String(locals.newUser._id), req, res, onSuccess, onFail);
	
	}
	
	async.series([
		
		// Perform basic validation
		function(next) {
			
			if (!locals.form['name.first'] || !locals.form['name.last'] || !locals.form.email || !locals.form.password || !locals.form.website) {
				console.log('[api.app.siginup] - Failed signing up.');
				console.log('------------------------------------------------------------');
				return res.apiResponse({
					success: false,
					session: false
				});
			}
			
			return next();
			
		},
		
		// Check for user by email
		function(next) {
			
			console.log('[api.app.signup]  - Searching for existing users via [' + locals.form.email + '] email address...');
			console.log('------------------------------------------------------------');
			
			var query = User.model.findOne();
				query.where('email', locals.form.email);
				query.exec(function(err, user) {
					if (err) {
						console.log('[api.app.signup]  - Error finding existing user via email.', err);
						console.log('------------------------------------------------------------');
						return next({ message: 'Sorry, there was an error processing your information, please try again.' });
					}
					if (user) {
						console.log('[api.app.signup]  - Found existing user via email address...');
						console.log('------------------------------------------------------------');
						return next({ message: 'There\'s already an account with that email address, please sign-in instead.' });
					}
					return next();
				});
			
		},
		
		// Create user
		function(next) {
		
			console.log('[api.app.signup]  - Creating new user...');
			console.log('------------------------------------------------------------');
			
			var userData = {
				name: {
					first: locals.form['name.first'],
					last: locals.form['name.last']
				},
				email: locals.form.email,
				password: locals.form.password,
				
				state: 'enabled',
				
				website: locals.form.website,
				
				isVerified: false,
				
				notifications: {
					posts: locals.form.alertsNotifications,
					meetups: locals.form.alertsNotifications
				},
				
				services: {}
			};
			
			// console.log('[api.app.signup]  - New user data:', userData );
			
			locals.newUser = new User.model(userData);
			
			locals.newUser.save(function(err) {
				if (err) {
					console.log('[api.app.signup]  - Error saving new user.', err);
					console.log('------------------------------------------------------------');
					return next({ message: 'Sorry, there was an error processing your account, please try again.' });
				}
				console.log('[api.app.signup]  - Saved new user.');
				console.log('------------------------------------------------------------');
				return next();
			});
		
		},
		
		// Session
		function(next) {
			return doSignIn();
		}
		
	], function(err) {
		if (err) {
			console.log('[api.app.signup]  - Issue signing user in.', err);
			console.log('------------------------------------------------------------');
			return res.apiResponse({
				success: false,
				session: false,
				message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
			});
		}
	});
	
}
