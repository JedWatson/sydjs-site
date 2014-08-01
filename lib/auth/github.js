var async = require('async'),
	_ = require('underscore'),
	request = require('request');

var passport = require('passport'),
	passportGithubStrategy = require('passport-github').Strategy;

var keystone = require('keystone'),
	User = keystone.list('User');

var credentials = {
	clientID: process.env.GITHUB_CLIENT_ID,
	clientSecret: process.env.GITHUB_CLIENT_SECRET,
	callbackURL: process.env.GITHUB_CALLBACK_URL
};

exports.authenticateUser = function(req, res, next)
{
	var self = this;
	
	var redirect = '/auth/confirm';
	if (req.cookies.target && req.cookies.target == 'app') redirect = '/auth/app';
	
	// Begin process
	console.log('============================================================');
	console.log('[services.github] - Triggered authentication process...');
	console.log('------------------------------------------------------------');
	
	// Initalise GitHub credentials
	var githubStrategy = new passportGithubStrategy(credentials, function(accessToken, refreshToken, profile, done) {
		done(null, {
			accessToken: accessToken,
			refreshToken: refreshToken,
			profile: profile
		});
	});
	
	// Pass through authentication to passport
	passport.use(githubStrategy);
	
	// Save user data once returning from GitHub
	if (_.has(req.query, 'cb')) {
		
		console.log('[services.github] - Callback workflow detected, attempting to process data...');
		console.log('------------------------------------------------------------');
		
		passport.authenticate('github', { session: false }, function(err, data, info) {
		
			if (err || !data) {
				console.log("[services.github] - Error retrieving GitHub account data - " + JSON.stringify(err));
				return res.redirect('/signin');
			}
			
			console.log('[services.github] - Successfully retrieved GitHub account data, processing...');
			console.log('------------------------------------------------------------');
			
			var name = data.profile && data.profile.displayName ? data.profile.displayName.split(' ') : [];
			
			var auth = {
				type: 'github',
				
				name: {
					first: name.length ? name[0] : '',
					last: name.length > 1 ? name[1] : ''
				},
				
				website: data.profile._json.blog,
				
				profileId: data.profile.id,
				
				username: data.profile.username,
				avatar: data.profile._json.avatar_url,
				
				accessToken: data.accessToken,
				refreshToken: data.refreshToken
			}
			
			// GitHub Specific: Retrieve email address
			self.getEmails(auth.accessToken, function(err, email) {
				if (!err && email) auth.email = email;
				req.session.auth = auth;
				return res.redirect(redirect);
			});
			
		})(req, res, next);
	
	// Perform inital authentication request to GitHub
	} else {
		
		console.log('[services.github] - Authentication workflow detected, attempting to request access...');
		console.log('------------------------------------------------------------');
		
		passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
	
	}
	
};

exports.getEmails = function(accessToken, next)
{
	console.log('[services.github] - Finding GitHub email addresses...');
	console.log('------------------------------------------------------------');
	
	request({
		url: 'https://api.github.com/user/emails?access_token=' + accessToken,
		headers: {
			'User-Agent': 'sydjs.com'
		}
	}, function(err, data) {
	
		if (err) {
			
			console.log(err);
			console.log('[services.github] - Error retrieving GitHub email addresses.');
			console.log('------------------------------------------------------------');
			
			return next(err);
			
		} else {
			
			console.log('[services.github] - Retrieved GitHub email addresses...');
			console.log('------------------------------------------------------------');
			
			var emails = JSON.parse(data.body),
				primaryEmail = false;
			
			if (emails.length) {
				_.each(emails, function(e) {
					if (!e.primary) return;
					primaryEmail = e.email;
				});
			}
			
			return next(err, primaryEmail);
			
		}
		
	});
};
