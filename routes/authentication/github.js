var async = require('async'),
	keystone = require('keystone');

var github = require('../../lib/services/github');

exports = module.exports = function(req, res, next) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	async.series([
		
		function(cb) {
			
			if (!req.user) return cb();
			
			keystone.session.signout(req, res, function() {
				return cb();
			});
			
		}
		
	], function(err) {
	
		github.authenticateUser(req, res, next, function(err, type) {
		
			/*
				/signin
				
					- Success: /profile/{user.id} (signed in, redirected)
					- Fail: /signin (error displayed)
			*/
			
			// Define redirects for success and fail responses
			var redirects = {
				success: '/me',
				fail: '/signin'
			}
			
			// Redirect based on response
			if (err) {
			
				console.log('[auth.github] - GitHub authentication failed - ' + JSON.stringify(err));
				console.log('------------------------------------------------------------');
				
				return res.redirect(redirects.fail);
			
			} else {
			
				console.log('[auth.github] - GitHub authentication was successful.');
				console.log('------------------------------------------------------------');
				
				return res.redirect(redirects.success);
			
			}
		
		});
	
	});

};
