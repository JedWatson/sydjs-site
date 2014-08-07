var _ = require('underscore'),
	querystring = require('querystring'),
	keystone = require('keystone');


/**
	Initialises the standard view locals
*/

exports.initLocals = function(req, res, next) {
	
	var locals = res.locals;
	
	locals.navLinks = [
		{ label: 'Home',		key: 'home',		href: '/' },
		{ label: 'About',		key: 'about',		href: '/about' },
		{ label: 'Meetups',		key: 'meetups',		href: '/meetups' },
		{ label: 'Members',		key: 'members',		href: '/members' },
		{ label: 'Blog',		key: 'blog',		href: '/blog' },
		{ label: 'Showbag',		key: 'showbag',		href: '/showbag' }
	];
	
	locals.user = req.user;
	
	locals.basedir = keystone.get('basedir');
	
	locals.page = {
		title: 'SydJS',
		path: req.url.split("?")[0] // strip the query - handy for redirecting back to the page
	};
	
	locals.qs_set = qs_set(req, res);
	
	if (req.cookies.target && req.cookies.target == locals.page.path) res.clearCookie('target');

	//	TW 2013-04-12: User agent testing, is there a better solution or location for this?
	var ua = req.headers['user-agent'];
	locals.system = [];
	locals.browser = [];
	
	if (/mobile/i.test(ua)) {
		locals.system.mobile = true;
	}
	if (/like Mac OS X/.test(ua)) {
		try {
			locals.system.ios = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
			locals.system.iphone = /iPhone/.test(ua);
			locals.system.ipad = /iPad/.test(ua);
		} catch(e) {
			console.log('[locals] - Bad user agent [like Mac OS X] detected: ' + JSON.stringify(ua));
		}
	}
	if (/Android/.test(ua)) {
		var android = /Android ([0-9\.]+)[\);]/.exec(ua);
		if (android) {
			locals.system.android = android[1];
		}
	}
	
	if ( /MSIE/.test(ua) ) {
		locals.browser.name = 'ie';
		if ( /MSIE 9.0/.test(ua) ) {
			locals.browser.version = 9;
		} else if ( /MSIE 10.0/.test(ua) ) {
			locals.browser.version = 10;
		}
	}
	
	next();
	
};


/**
	Make sponsors universally available
*/

exports.loadSponsors = function(req, res, next) {
	
	keystone.list('Organisation').model.find().sort('name').exec(function(err, sponsors) {
		if (err) return next(err);
		req.sponsors = sponsors;
		res.locals.sponsors = sponsors;
		next();
	});
	
}


/**
	Inits the error handler functions into `req`
*/

exports.initErrorHandlers = function(req, res, next) {
	
	res.err = function(err, title, message) {
		res.status(500).render('errors/500', {
			err: err,
			errorTitle: title,
			errorMsg: message
		});
	}
	
	res.notfound = function(title, message) {
		res.status(404).render('errors/404', {
			errorTitle: title,
			errorMsg: message
		});
	}
	
	next();
	
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {
	
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};
	
	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length }) ? flashMessages : false;
	
	next();
	
};

/**
	Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {
	
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/signin');
	} else {
		next();
	}
	
}

/**
	Prevents people from accessing the site while it's been updated
 */

exports.restrictSite = function(req, res, next) {
	
	if (!req.user) {
		if (req.url != '/maintenance') return res.redirect('/maintenance');
		next();
	} else {
		next();
	}
	
}

/**
	Returns a closure that can be used within views to change a parameter in the query string
	while preserving the rest.
*/

var qs_set = exports.qs_set = function(req, res) {

	return function qs_set(obj) {

		var params = _.clone(req.query);

		for (var i in obj) {
			if (obj[i] === undefined || obj[i] === null) {
				delete params[i];
			} else if (obj.hasOwnProperty(i)) {
				params[i] = obj[i];
			}
		}

		var qs = querystring.stringify(params);

		return req.path + (qs ? '?' + qs : '');

	}

}
