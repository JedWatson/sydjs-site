// Load .env for development environments
require('dotenv')().load();

var keystone = require('keystone'),
	pkg = require('./package.json');

/**
 * Application Initialisation
 */

keystone.init({
	
	'name': 'SydJS',
	'brand': 'SydJS',
	
	'favicon': 'public/favicon.ico',
	'less': 'public',
	'static': 'public',
	
	'views': 'templates/views',
	'view engine': 'jade',
	
	'auto update': true,
	'mongo': process.env.MONGO_URI || 'mongodb://localhost/' + pkg.name,
	
	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': process.env.COOKIE_SECRET || 'sydjs',
	
	'ga property': process.env.GA_PROPERTY,
	'ga domain': process.env.GA_DOMAIN
	
});

require('./models');

keystone.set('routes', require('./routes'));

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	ga_property: keystone.get('ga property'),
	ga_domain: keystone.get('ga domain')
});

keystone.set('nav', {
	'meetups': ['meetups', 'talks'],
	'members': ['users', 'organisations'],
	'posts': ['posts', 'post-categories'],
});
	
keystone.start();
