var keystone = require('keystone'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {
	
	var locals = {
		form: req.body
	};
	
	if (!locals.form.email) {
		console.log('[api.app.reset-password] - Must provide email address.');
		console.log('------------------------------------------------------------');
		return res.apiResponse({
			success: false,
			session: false
		});
	}
	
	User.model.findOne().where('email', locals.form.email).exec(function(err, user) {
		if (err) {
			console.log('[api.app.reset-password] - Error finding existing user via email.', err);
			console.log('------------------------------------------------------------');
			return res.apiResponse({
				success: false,
				message: 'Sorry, there was an error processing your information, please try again.'
			});
		}
		if (!user) {
			console.log('[api.app.reset-password] - Couldn\'t find matching user.');
			console.log('------------------------------------------------------------');
			return res.apiResponse({
				success: false,
				message: 'No matching account found.'
			});
		}
		user.resetPassword(function(err) {
			if (err) {
				console.log('[api.app.reset-password] - Error reseting user password.', err);
				console.log('------------------------------------------------------------');
				return res.apiResponse({
					success: false,
					message: 'Sorry, there was an error reseting your password, please try again.'
				});
			}
			return res.apiResponse({
				success: true
			});
		});
	});
	
}
