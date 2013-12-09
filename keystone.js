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
	'back': '/me',

	'favicon': 'public/favicon.ico',
	'less': 'public',
	'static': 'public',

	'views': 'templates/views',
	'view engine': 'jade',
	
	'emails': 'templates/emails',
	'mandrill api key': 'E6GbybG5lBkJEe9LA22Skw',

	'auto update': true,
	'mongo': process.env.MONGO_URI || 'mongodb://localhost/' + pkg.name,

	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': process.env.COOKIE_SECRET || 'sydjs',

	'google api key': process.env.GOOGLE_BROWSER_KEY,
	'google server api key': process.env.GOOGLE_SERVER_KEY,

	'ga property': process.env.GA_PROPERTY,
	'ga domain': process.env.GA_DOMAIN,
	
	'chartbeat property': process.env.CHARTBEAT_PROPERTY,
	'chartbeat domain': process.env.CHARTBEAT_DOMAIN
	
});

require('./models');

keystone.set('routes', require('./routes'));

keystone.set('locals', {
	_: require('underscore'),
	js: 'javascript:;',
	env: keystone.get('env'),
	utils: keystone.utils,
	plural: keystone.utils.plural,
	editable: keystone.content.editable,
	google_api_key: keystone.get('google api key'),
	ga_property: keystone.get('ga property'),
	ga_domain: keystone.get('ga domain'),
	chartbeat_property: keystone.get('chartbeat property'),
	chartbeat_domain: keystone.get('chartbeat domain')
});

keystone.set('email locals', {
	keystoneURL: 'http://www.sydjs.com/keystone',
	logo: '/images/logo_email.jpg',
	logo_width: 120,
	logo_height: 112,
	theme: {
		email_bg: '#f9f9f9',
		link_color: '#2697de'
	}
});

keystone.set('email tests', {
	'forgotten-password': {
		name: 'User',
		link: 'http://www.sydjs.com/reset-password/key'
	}
});

keystone.set('nav', {
	'meetups': ['meetups', 'talks'],
	'members': ['users', 'organisations'],
	'posts': ['posts', 'post-categories', 'post-comments'],
	'links': ['links', 'link-tags', 'link-comments']
});

keystone.start();
