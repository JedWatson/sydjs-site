var keystone = require('keystone');

var Link = keystone.list('Link');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'links';
	locals.filters = {
		link: req.params.link
	};
	
	// Load the current post
	view.query('data.link',
		Link.model.findOne()
			.where('state', 'published')
			.where('slug', locals.filters.link)
			.populate('author categories')
	).none(res.notfound);
	
	// Load recent posts
	view.query('data.links',
		Link.model.find()
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('author')
			.limit('4')
	);
	
	// Render the view
	view.render('site/link');
	
}
