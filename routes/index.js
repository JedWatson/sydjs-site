var babelify = require('babelify');
var bodyParser = require('body-parser');
var browserify = require('browserify-middleware');
var clientConfig = require('../client/config');
var keystone = require('keystone');
var middleware = require('./middleware');
var graphqlHTTP = require('express-graphql');
var graphQLSchema = require('../graphql/basicSchema').default;
var relaySchema = require('../graphql/relaySchema').default;

var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);
keystone.pre('routes', middleware.loadSponsors);
keystone.pre('render', middleware.flashMessages);

// Handle 404 errors
keystone.set('404', function (req, res, next) {
	res.notfound();
});

// Handle other errors
keystone.set('500', function (err, req, res, next) {
	var title, message;
	if (err instanceof Error) {
		message = err.message;
		err = err.stack;
	}
	res.status(500).render('errors/500', {
		err: err,
		errorTitle: title,
		errorMsg: message
	});
});

// Load Routes
var routes = {
	api: importRoutes('./api'),
	views: importRoutes('./views'),
	auth: importRoutes('./auth'),
};

// Bind Routes
exports = module.exports = function (app) {

	// Browserification
	app.get('/js/packages.js', browserify(clientConfig.packages, {
		cache: true,
		precompile: true,
	}));

	app.use('/js', browserify('./client/scripts', {
		external: clientConfig.packages,
		transform: [
			babelify.configure({
				presets: ['es2015', 'react']
			}),
		],
	}));

	// GraphQL
	app.use('/api/graphql', graphqlHTTP({ schema: graphQLSchema, graphiql: true }));
	app.use('/api/relay', graphqlHTTP({ schema: relaySchema, graphiql: true }));

	// Allow cross-domain requests (development only)
	if (process.env.NODE_ENV !== 'production') {
		console.log('------------------------------------------------');
		console.log('Notice: Enabling CORS for development.');
		console.log('------------------------------------------------');
		app.all('*', function (req, res, next) {
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
	app.get('/members', routes.views.members);
	app.get('/members/mentors', routes.views.mentors);
	app.get('/member/:member', routes.views.member);
	app.get('/organisations', routes.views.organisations);
	app.get('/links', routes.views.links);
	app.get('/links/:tag?', routes.views.links);
	app.all('/links/link/:link', routes.views.link);
	app.get('/blog/:category?', routes.views.blog);
	app.all('/blog/post/:post', routes.views.post);
	app.get('/about', routes.views.about);
	app.get('/mentoring', routes.views.mentoring);

	app.get('/showbag', routes.views.showbag);

	// Session
	app.all('/join', routes.views.session.join);
	app.all('/signin', routes.views.session.signin);
	app.get('/signout', routes.views.session.signout);
	app.all('/forgot-password', routes.views.session['forgot-password']);
	app.all('/reset-password/:key', routes.views.session['reset-password']);

	// Authentication
	app.all('/auth/confirm', routes.auth.confirm);
	app.all('/auth/app', routes.auth.app);
	app.all('/auth/:service', routes.auth.service);

	// User
	app.all('/me*', middleware.requireUser);
	app.all('/me', routes.views.me);
	app.all('/me/create/post', routes.views.createPost);
	app.all('/me/create/link', routes.views.createLink);

	// Tools
	app.all('/notification-center', routes.views.tools['notification-center']);

	// API
	app.all('/api*', keystone.middleware.api);
	app.all('/api/me/meetup', routes.api.me.meetup);
	app.all('/api/stats', routes.api.stats);
	app.all('/api/meetup/:id', routes.api.meetup);

	// API - App
	app.all('/api/app/status', routes.api.app.status);
	app.all('/api/app/rsvp', routes.api.app.rsvp);
	app.all('/api/app/signin-email', routes.api.app['signin-email']);
	app.all('/api/app/signup-email', routes.api.app['signup-email']);
	app.all('/api/app/signin-service', routes.api.app['signin-service']);
	app.all('/api/app/signin-service-check', routes.api.app['signin-service-check']);
	app.all('/api/app/signin-recover', routes.api.app['signin-recover']);

}
