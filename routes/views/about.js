var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'about';
	
	locals.organisers = [
		{ name: 'Craig Sharkie',    image: '/images/organiser-craig_sharkie.jpg',    twitter: 'twalve',            title: 'Founder, coordinator, ticket wrangler, emcee, and chief herder' },
		{ name: 'Gil Davidson',     image: '/images/organiser-gil_davidson.jpg',     twitter: 'iamnotyourbroom',   title: 'Site coordinator' },
		{ name: 'Adam Ahmed',       image: '/images/organiser-adam_ahmed.jpg',       twitter: 'hitsthings',        title: 'Atlassian coordinator' },
		{ name: 'Lachlan Hardy',     image: '/images/organiser-lachlan_hardy.jpg',   twitter: 'lachlanhardy',      title: 'Community coordinator' }
	]
	
	view.render('site/about');
	
}
