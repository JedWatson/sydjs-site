var keystone = require('keystone');

var Post = keystone.list('Post');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'blog';
	locals.filters = {
		post: req.params.post
	};
	
	// Load the current post
	view.query('data.post',
		Post.model.findOne()
			.where('state', 'published')
			.where('slug', locals.filters.post)
			.populate('author categories')
	).none(res.notfound);
	
	// Load recent posts
	view.query('data.posts',
		Post.model.find()
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('author')
			.limit('4')
	);
	
	// Render the view
	view.render('site/post');
	
}
