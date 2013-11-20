var keystone = require('keystone'),
	Post = keystone.list('Post');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'me';
	locals.title = 'Create a blog post - SydJS';
	
	view.on('post', { action: 'create-post' }, function(next) {

		// handle form
		var newPost = new Post.model({
				author: locals.user.id,
				publishedDate: new Date()
			}),

			updater = newPost.getUpdateHandler(req, res, {
				errorMessage: 'There was an error creating your new post:'
			});
		
		updater.process(req.body, {
			flashErrors: true,
			logErrors: true,
			fields: 'title,image,content.extended'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				req.flash('success', 'Your new post has been created successfully.');
				return res.redirect('/blog/post/' + newPost.slug);
			}
			next();
		});

	});
	
	view.render('site/createPost');
	
}
