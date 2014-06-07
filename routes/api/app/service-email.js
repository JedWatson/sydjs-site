var keystone = require('keystone'),
	request = require('request'),
	_ = require('underscore');

exports = module.exports = function(req, res) {
	
	var locals = {
		authUser: req.body.authUser
	}
	
	if (locals.authUser.type != 'github') return res.apiResponse({ success: true, email: false });
	
	console.log('[api.app.service-email]  - Finding GitHub email addresses...');
	console.log('------------------------------------------------------------');
	
	request({
		url: 'https://api.github.com/user/emails?access_token=' + locals.authUser.accessToken,
		headers: {
			'User-Agent': 'sydjs.com'
		}
	}, function(err, data) {
	
		if (err) {
			console.log(err);
			console.log('[api.app.service-email]  - Error retrieving GitHub email addresses.');
			console.log('------------------------------------------------------------');
			return next();
			
		} else {
			
			console.log('[api.app.service-email]  - Retrieved GitHub email addresses...');
			console.log('------------------------------------------------------------');
			
			var emails = JSON.parse(data.body);
			
			if (emails.length) {
				_.each(emails, function(e) {
					if (!e.primary) return;
					return res.apiResponse({ success: true, email: e.email });
				});
			} else {
				return res.apiResponse({ success: true, email: false });
			}
			
		}
		
	});
	
};
