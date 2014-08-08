var keystone = require('keystone');

var Post = keystone.list('Post');
	PostComment = keystone.list('PostComment');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'blog';
	locals.filters = {
		post: req.params.post
	};
	
	view.on('init', function(next) {

		Post.model.findOne()
			.where('slug', locals.filters.post)
			.populate('author categories')
			.exec(function(err, post) {
				
				if (err) return res.err(err);
				if (!post) return res.notfound('Post not found');
				
				// Allow admins or the author to see draft posts
				if (post.state == 'published' || (req.user && req.user.isAdmin) || (req.user && post.author && (req.user.id == post.author.id))) {
					locals.post = post;
					locals.post.populateRelated('comments[author]', next);
					locals.page.title = post.title + ' - Blog - SydJS';
				} else {
					return res.notfound('Post not found');
				}
				
			});

	});
	
	// Load recent posts
	view.query('data.posts',
		Post.model.find()
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('author')
			.limit('4')
	);
	
	view.on('post', { action: 'create-comment' }, function(next) {

		// handle form
		var newPostComment = new PostComment.model({
				post: locals.post.id,
				author: locals.user.id
			}),
			updater = newPostComment.getUpdateHandler(req, res, {
				errorMessage: 'There was an error creating your comment:'
			});
			
		updater.process(req.body, {
			flashErrors: true,
			logErrors: true,
			fields: 'content'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				req.flash('success', 'Your comment has been added successfully.');
				return res.redirect('/blog/post/' + locals.post.slug);
			}
			next();
		});

	});
	
	// Render the view
	view.render('site/post');
	
}
