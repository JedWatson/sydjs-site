var async = require('async'),
	keystone = require('keystone'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {

	console.log(req.body);
	
	User.model.findById(req.body.user).exec(function(err, user) {
		if (err || !user) return res.apiResponse({ success: false });
		if (user.services.pushNotifications.isConfigured) {
			user.set({
				services: {
					pushNotifications: {
						enabled: req.body.enable == 'true'
					}
				}
			});
			user.save(function(err) {
				console.log('[api.app.notify] - Set notifications.');
				if (err) return res.apiResponse({ success: false });
				return res.apiResponse({ success: true });
			});
		} else {
			user.set({
				services: {
					pushNotifications: {
						isConfigured: true,
						enabled: true,
						deviceId: req.body.deviceId,
						userId: req.body.userId
					}
				}
			});
			user.save(function(err) {
				console.log('[api.app.notify] - Set notifications.');
				if (err) return res.apiResponse({ success: false });
				return res.apiResponse({ success: true });
			});
		}
	});
	
}
