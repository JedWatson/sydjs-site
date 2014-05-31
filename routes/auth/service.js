var keystone = require('keystone'),
	async = require('async');

var services = {
	github: require('../../lib/auth/github'),
	facebook: require('../../lib/auth/twitter'),
	google: require('../../lib/auth/google'),
	twitter: require('../../lib/auth/twitter')
}

exports = module.exports = function(req, res) {

	if (!req.params.service) {
		console.log('[auth.service] - You must define the service you wish to authenticate with.');
		return res.redirect('/login');
	}
	
	services[req.params.service].authenticateUser(req, res);

};
