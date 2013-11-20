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
	views: importRoutes('./views'),
	authentication: importRoutes('./authentication')
};

// Bind Routes
exports = module.exports = function(app) {
	
	// Website
	app.get('/', routes.views.index);
	app.get('/meetups', routes.views.meetups);
	app.get('/members/:filter(mentors)?', routes.views.members);
	app.get('/members/organisations', routes.views.organisations);
	app.get('/links', routes.views.links);
	app.get('/blog/:category?', routes.views.blog);
	app.get('/blog/post/:post', routes.views.post);
	app.get('/about', routes.views.about);
	app.get('/mentoring', routes.views.mentoring);
	
	// Session
	app.all('/:mode(signin|join|forgot|attend)', routes.views.signin);
	app.get('/signout', routes.views.signout);
	
	// Authentication
	app.get('/authentication/github', routes.authentication.github);
	app.get('/authentication/twitter', routes.authentication.twitter);
	app.get('/authentication/facebook', routes.authentication.facebook);
	
	// User
	app.all('/me', routes.views.me);

}
