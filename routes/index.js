var _ = require('underscore'),
	keystone = require('keystone'),
	middleware = require('./middleware'),
	importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);
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
	authentication: importRoutes('./authentication')
};

// Bind Routes
exports = module.exports = function(app) {
	
	// Old
	// app.get('/', routes.views.old);
	
	// Website
	app.get('/', routes.views.index);
	app.get('/meetups', routes.views.meetups);
	app.get('/members/:filter(mentors)?', routes.views.members);
	app.get('/members/organisations', routes.views.organisations);
	app.get('/links', routes.views.links);
	app.get('/links/:tag?', routes.views.links);
	app.all('/links/link/:link', routes.views.link);
	app.get('/blog/:category?', routes.views.blog);
	app.all('/blog/post/:post', routes.views.post);
	app.get('/about', routes.views.about);
	app.get('/mentoring', routes.views.mentoring);
	
	// Session
	app.all('/:mode(signin|join|attend)', routes.views.signin);
	app.get('/signout', routes.views.signout);
	app.all('/forgot-password', routes.views['forgot-password']);
	app.all('/reset-password/:key', routes.views['reset-password']);
	
	// Authentication
	app.get('/authentication/github', routes.authentication.github);
	app.get('/authentication/twitter', routes.authentication.twitter);
	app.get('/authentication/facebook', routes.authentication.facebook);
	
	// User
	app.all('/me*', middleware.requireUser);
	app.all('/me', routes.views.me);
	app.all('/me/create/post', routes.views.createPost);
	app.all('/me/create/link', routes.views.createLink);
	
	// API
	app.all('/api*', keystone.initAPI);
	app.all('/api/me/meetup', routes.api.me.meetup);
	app.all('/api/stats', routes.api.stats);

}
