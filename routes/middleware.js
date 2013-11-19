var _ = require('underscore'),
	keystone = require('keystone');

exports.initLocals = function(req, res, next) {
	
	res.locals.navLinks = [
		{ label: 'Home',      key: 'home',      href: '/',          layout: 'left' },
		{ label: 'Meetups',   key: 'meetups',   href: '/meetups',   layout: 'left' },
		{ label: 'Members',   key: 'members',   href: '/members',   layout: 'left' },
		{ label: 'Links',     key: 'links',     href: '/links',     layout: 'left' },
		{ label: 'Blog',      key: 'blog',      href: '/blog',      layout: 'right' },
		{ label: 'About',     key: 'about',     href: '/about',     layout: 'right' },
		{ label: 'Mentoring', key: 'mentoring', href: '/mentoring', layout: 'right' }
	];
	
	res.locals.user = req.user;
	
	next();
	
};

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
