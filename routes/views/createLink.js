var keystone = require('keystone'),
	Link = keystone.list('Link');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'me';
	locals.page.title = 'Add a link - SydJS';
	
	view.on('post', { action: 'add-link' }, function(next) {

		// handle form
		var newLink = new Link.model({
				author: locals.user.id,
				publishedDate: new Date()
			}),

			updater = newLink.getUpdateHandler(req, res, {
				errorMessage: 'There was an error adding your link:'
			});
		
		// automatically pubish posts by admin users
		if (locals.user.isAdmin) {
			newLink.state = 'published';
		}
		
		updater.process(req.body, {
			flashErrors: true,
			logErrors: true,
			fields: 'href,label,description'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				req.flash('success', 'Your link has been added' + ((newLink.state == 'draft') ? ' and will appear on the site once it\'s been approved' : '') + '.');
				return res.redirect('/links');
			}
			next();
		});

	});
	
	view.render('site/createLink');
	
}
