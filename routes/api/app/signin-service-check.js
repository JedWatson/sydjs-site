var keystone = require('keystone'),
	async = require('async'),
	request = require('request'),
	_ = require('underscore'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {
	
	var locals = {
		authUser: req.body.authUser,
		
		existingUser: false
	}
	
	// Function to handle signin
	var doSignIn = function() {
	
		console.log('[api.app.service]  - Signing in user...');
		console.log('------------------------------------------------------------');
		
		var onSuccess = function(user) {
			console.log('[api.app.service]  - Successfully signed in.');
			console.log('------------------------------------------------------------');
			return res.apiResponse({
				success: true,
				session: true,
				date: new Date().getTime(),
				userId: user.id
			});
		}
		
		var onFail = function(err) {
			console.log('[api.app.service]  - Failed signing in.', err);
			console.log('------------------------------------------------------------');
			return res.apiResponse({
				success: false,
				session: false,
				message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
			});
		}
		
		keystone.session.signin(String(locals.existingUser._id), req, res, onSuccess, onFail);
	
	}
	
	// Function to handle data confirmation process
	async.series([
		
		// Check for user by profile id (only if not signed in)
		function(next) {
			
			console.log('[api.app.service]  - Searching for existing users via [' + locals.authUser.type + '] profile id...');
			console.log('------------------------------------------------------------');
			
			var query = User.model.findOne();
				query.where('services.' + locals.authUser.type + '.profileId', locals.authUser.profileId);
				query.exec(function(err, user) {
					if (err) {
						console.log('[api.app.service]  - Error finding existing user via profile id.', err);
						console.log('------------------------------------------------------------');
						return next({ message: 'Sorry, there was an error processing your information, please try again.' });
					}
					if (user) {
						console.log('[api.app.service]  - Found existing user via [' + locals.authUser.type + '] profile id...');
						console.log('------------------------------------------------------------');
						locals.existingUser = user;
						return doSignIn();
					}
					return next();
				});
		
		},
		
		// Return that no existing user exists
		function() {
			console.log('[api.app.service]  - No existing user detected.');
			console.log('------------------------------------------------------------');
			return res.apiResponse({
				success: true,
				session: false,
				date: new Date().getTime(),
				userId: false
			});
		}
	
	], function(err) {
		if (err) {
			console.log('[api.app.service]  - Issue signing user in.', err);
			console.log('------------------------------------------------------------');
			return res.apiResponse({
				success: false,
				session: false,
				message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
			});
		}
	});

}
