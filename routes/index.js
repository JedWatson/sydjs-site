var _ = require('underscore'),
	keystone = require('keystone'),
	middleware = require('./middleware'),
	importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);
keystone.pre('routes', middleware.loadSponsors);
keystone.pre('render', middleware.flashMessages);

// Handle 404 errors
keystone.set('404', function(req, res, next) {
	res.notfound();
});

// Handle other errors
keystone.set('500', function(err, req, res, next) {
	var title, message;
	if (err instanceof Error) {
		message = err.message;
		err = err.stack;
	}
	res.err(err, title, message);
});

// Load Routes
var routes = {
	api: importRoutes('./api'),
	views: importRoutes('./views'),
	auth: importRoutes('./auth')
};

// Bind Routes
exports = module.exports = function(app) {
	
	// Old
	// app.get('/', routes.views.old);
	
	// Allow cross-domain requests (development only)
	if (process.env.NODE_ENV != 'production') {
		console.log('------------------------------------------------');
		console.log('Notice: Enabling CORS for development.');
		console.log('------------------------------------------------');
		app.all('*', function(req, res, next) {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Methods', 'GET, POST');
			res.header('Access-Control-Allow-Headers', 'Content-Type');
			next();
		});
	}
	
	// Website
	app.get('/', routes.views.index);
	app.get('/meetups', routes.views.meetups);
	app.get('/meetups/:meetup', routes.views.meetup);
	app.get('/members/:filter(mentors)?', routes.views.members);
	app.get('/member/:member', routes.views.member);
	app.get('/organisations', routes.views.organisations);
	app.get('/links', routes.views.links);
	app.get('/links/:tag?', routes.views.links);
	app.all('/links/link/:link', routes.views.link);
	app.get('/blog/:category?', routes.views.blog);
	app.all('/blog/post/:post', routes.views.post);
	app.get('/about', routes.views.about);
	app.get('/mentoring', routes.views.mentoring);
	
	// Session
	app.all('/join', routes.views.session.join);
	app.all('/signin', routes.views.session.signin);
	app.get('/signout', routes.views.session.signout);
	app.all('/forgot-password', routes.views.session['forgot-password']);
	app.all('/reset-password/:key', routes.views.session['reset-password']);
	
	// Authentication
	app.all('/auth/confirm', routes.auth.confirm);
	// TODO: app.all('/auth/verify', routes.auth.verify);
	app.all('/auth/:service', routes.auth.service);
	
	// User
	app.all('/me*', middleware.requireUser);
	app.all('/me', routes.views.me);
	app.all('/me/create/post', routes.views.createPost);
	app.all('/me/create/link', routes.views.createLink);
	
	// API
	app.all('/api*', keystone.initAPI);
	app.all('/api/me/meetup', routes.api.me.meetup);
	app.all('/api/stats', routes.api.stats);
	
	// API - App
	app.get('/api/app/ping', routes.api.app.ping);
	app.all('/api/app/status', routes.api.app.status);
	app.all('/api/app/rsvp', routes.api.app.rsvp);
	app.all('/api/app/signin', routes.api.app.signin);
	app.all('/api/app/notify', routes.api.app.notify);
	
	app.all('/api/app/service-email', routes.api.app['service-email']);
	app.all('/api/app/service-confirm', routes.api.app['service-confirm']);

}
