var keystone = require('keystone'),
	Post = keystone.list('Post');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'me';
	locals.page.title = 'Create a blog post - SydJS';
	
	view.on('post', { action: 'create-post' }, function(next) {

		// handle form
		var newPost = new Post.model({
				author: locals.user.id,
				publishedDate: new Date()
			}),

			updater = newPost.getUpdateHandler(req, res, {
				errorMessage: 'There was an error creating your new post:'
			});
		
		// automatically publish posts by admin users
		if (locals.user.isAdmin) {
			newPost.state = 'published';
		}
		
		updater.process(req.body, {
			flashErrors: true,
			logErrors: true,
			fields: 'title, image, content.extended'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				newPost.notifyAdmins();
				req.flash('success', 'Your post has been added' + ((newPost.state == 'draft') ? ' and will appear on the site once it\'s been approved' : '') + '.');
				return res.redirect('/blog/post/' + newPost.slug);
			}
			next();
		});

	});
	
	view.render('site/createPost');
	
}
