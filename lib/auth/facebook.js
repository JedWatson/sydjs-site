var async = require('async'),
	_ = require('underscore');

var passport = require('passport'),
	passportFacebookStrategy = require('passport-facebook').Strategy;

var keystone = require('keystone'),
	User = keystone.list('User');

var credentials = {
	clientID: process.env.FACEBOOK_CLIENT_ID,
	clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
	callbackURL: process.env.FACEBOOK_CALLBACK_URL
};

exports.authenticateUser = function(req, res, next)
{
	// Begin process
	console.log('============================================================');
	console.log('[services.facebook] - Triggered authentication process...');
	console.log('------------------------------------------------------------');
	
	// Initalise Facebook credentials
	var githubStrategy = new passportFacebookStrategy(credentials, function(accessToken, refreshToken, profile, done) {
		done(null, {
			accessToken: accessToken,
			refreshToken: refreshToken,
			profile: profile
		});
	});
	
	// Pass through authentication to passport
	passport.use(facebookStrategy);
	
	// Save user data once returning from Facebook
	if (_.has(req.query, 'cb')) {
		
		console.log('[services.facebook] - Callback workflow detected, attempting to process data...');
		console.log('------------------------------------------------------------');
		
		passport.authenticate('facebook', { session: false }, function(err, data, info) {
		
			if (err || !data) {
				console.log("[services.facebook] - Error retrieving Facebook account data - " + JSON.stringify(err) );
				return res.redirect('/login');
			}
			
			console.log('[services.facebook] - Successfully retrieved Facebook account data, processing...');
			console.log('------------------------------------------------------------');
			
			var name = data.profile && data.profile.displayName ? data.profile.displayName.split(' ') : [];
			
			var auth = {
				type: 'facebook',
				
				name: {
					first: name.length ? name[0] : '',
					last: name.length > 1 ? name[1] : ''
				},
				
				website: data.profile._json.blog,
				
				profileId: data.profile.id,
				
				username: data.profile.username,
				accessToken: data.accessToken,
				refreshToken: data.refreshToken
			}
			
			req.session.auth = auth;
			
			return res.redirect('/auth/confirm');
			
		})(req, res, next);
	
	// Perform inital authentication request to Facebook
	} else {
		
		console.log('[services.facebook] - Authentication workflow detected, attempting to request access...');
		console.log('------------------------------------------------------------');
		
		passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
	
	}
	
};
