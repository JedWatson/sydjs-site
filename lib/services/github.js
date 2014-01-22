var async = require('async'),
	_ = require('underscore');

var passport = require('passport'),
	passportGithubStrategy = require('passport-github').Strategy;

var keystone = require('keystone');
	User = keystone.list('User');

// Determine Environment
var production = process.env.NODE_ENV == 'production';

// Credentials
var credentials = {
	clientID: production ? 'a7159b508c032795b4d3' : '18a82482971639141674',
	clientSecret: production ? 'ff0870757018510104b221b5afcd262c87648cef' : '38b9c36aa2593953c2ebbf88638ab017283ce386',
	callbackURL: production ? 'http://www.sydjs.com/authentication/github?callback' : 'http://local.host:3000/authentication/github?callback'
};

// Authenticate User
exports.authenticateUser = function(req, res, next, callback)
{
	// Begin process
	console.log('============================================================');
	console.log('[services.github] - Triggered authentication process...');
	console.log('------------------------------------------------------------');
	
	// Set placeholder variables to hold our data
	var data = {
		githubUser: false, // Github user
		sydjsUser: false // SydJS user
	}
	
	// Initalise GitHub credentials
	var githubStrategy = new passportGithubStrategy(credentials, function(accessToken, refreshToken, profile, done) {
		
		done(null, {
			accessToken: accessToken,
			profile: profile
		});
	
	});
	
	// Pass through authentication to passport
	passport.use(githubStrategy);
	
	// Determine workflow
	var workflow = false;
	
	if ( _.has(req.query, 'callback' ) )
		workflow = 'save';
	
	// Function to process Github response and decide whether we should create or update a user
	var processGithubUser = function(githubUser) {
	
		data.githubUser = githubUser;
		
		// console.log(githubUser);
		
		if (req.user) {
		
			console.log('[services.github] - Existing user signed in, saving data...');
			console.log('------------------------------------------------------------');
			
			data.sydjsUser = req.user;
			
			return saveSydjsUser();
		
		} else {
		
			console.log('[services.github] - No user signed in, attempting to match via id...');
			console.log('------------------------------------------------------------');
			
			User.model.findOne({ 'services.github.profileId': data.githubUser.profile.id }, function(err, user) {
				
				if (err || !user) {
					console.log("[services.github] - No matching user found via id, creating new user...");
					console.log('------------------------------------------------------------');
					return createSydjsUser();
				}
				
				console.log("[services.github] - Matched user via id, updating user...");
				console.log('------------------------------------------------------------');
				
				data.sydjsUser = user;
				
				return saveSydjsUser();
				
			});
		
		}
	
	}
	
	// Function to create SydJS user
	var createSydjsUser = function() {
		
		console.log('[services.github] - Creating SydJS user...');
		console.log('------------------------------------------------------------');
		
		// Define data
		var splitName = data.githubUser.profile && data.githubUser.profile.displayName ? data.githubUser.profile.displayName.split(' ') : [],
			firstName = (splitName.length ? splitName[0] : ''),
			lastName = (splitName.length > 1 ? splitName[1] : '');
		
		// Structure data
		var userData = {
			name: {
				first: firstName,
				last: lastName
			},
			email: null, // GitHub API should return emails but isn't
			password: Math.random().toString(36).slice(-8),
			
			github: data.githubUser.profile.username,
			website: data.githubUser.profile._json.blog
		};
		
		console.log('[services.github] - SydJS user create data:', userData );
		
		// Create user
		data.sydjsUser = new User.model(userData);
		
		console.log('[services.github] - Created new instance of SydJS user.');
		console.log('------------------------------------------------------------');
		
		return saveSydjsUser();
		
	}
	
	// Function to save SydJS user
	var saveSydjsUser = function() {
		
		// Save the SydJS user data
		console.log('[services.github] - Saving SydJS user...');
		console.log('------------------------------------------------------------');
		
		var userData = {
			github: data.githubUser.profile.username,
			website: data.githubUser.profile._json.blog,
			
			services: {
				github: {
					isConfigured: true,
					
					profileId: data.githubUser.profile.id,
					profileUrl: data.githubUser.profile.profileUrl,
					username: data.githubUser.profile.username,
					accessToken: data.githubUser.accessToken
				}
			}
		};
		
		console.log('[services.github] - SydJS user update data:', userData );
		
		data.sydjsUser.set(userData);
		
		data.sydjsUser.save(function(err) {
			
			if (err) {
				console.log(err);
				console.log("[services.github] - Error saving SydJS user.");
				console.log('------------------------------------------------------------');
				return callback(err);
				
			} else {
				
				console.log("[services.github] - Saved SydJS user.");
				console.log('------------------------------------------------------------');
				
				if ( req.user )
					return callback();
				else
					return signinSydjsUser();
				
			}
			
		});
		
	}
	
	// Function to sign in SydJS user
	var signinSydjsUser = function() {
	
		console.log('[services.github] - Signing in SydJS user...');
		console.log('------------------------------------------------------------');
		
		var onSuccess = function(user) {
		
			console.log("[services.github] - Successfully signed in.");
			console.log('------------------------------------------------------------');
			
			return callback();
		
		}
		
		var onFail = function(err) {
			
			console.log("[services.github] - Failed signing in.");
			console.log('------------------------------------------------------------');
			
			return callback(true);
			
		}
		
		keystone.session.signin( String(data.sydjsUser._id), req, res, onSuccess, onFail);
	
	}
	
	// Perform workflow
	switch( workflow ) {
	
		// Save GitHub user data once returning from GitHub
		case 'save':
		
			console.log('[services.github] - Callback workflow detected, attempting to process data...');
			console.log('------------------------------------------------------------');
			
			passport.authenticate('github', {
				//
			}, function(err, data, info) {
			
				if (err || !data) {
					console.log("[services.github] - Error retrieving GitHub account data - " + JSON.stringify(err) );
					return callback(true);
				}
				
				console.log('[services.github] - Successfully retrieved GitHub account data, processing...');
				console.log('------------------------------------------------------------');
				
				return processGithubUser(data);
				
			})(req, res, next);
		
		break;
		
		// Authenticate with GitHub
		default:
		
			console.log('[services.github] - Authentication workflow detected, attempting to request access...');
			console.log('------------------------------------------------------------');
			
			passport.authenticate('github', {
				scope: [ 'user:email' ]
			})(req, res, next);
	
	}
	
};
