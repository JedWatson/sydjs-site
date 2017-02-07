var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'about';
	locals.page.title = 'About SydJS';

	locals.organisers = [
		{ name: 'Craig Sharkie', image: '/images/organisers/sharkie_400_round.png', twitter: 'twalve', title: 'Founder, MC, Coordinator', profile: '/member/sharkie' },
		{ name: 'Jed Watson', image: '/images/organisers/jedwatson_400_round.png', twitter: 'jedwatson', title: 'Community coordinator', profile: '/member/jed-watson' },
		{ name: 'John van der Loo', image: '/images/organisers/johnvanderloo_400_round.png', twitter: 'geekyjohn', title: 'Atlassian coordinator', profile: '/member/john-van-der-loo' }
	]

	view.render('site/about');

}
