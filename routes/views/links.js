var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'links';
	locals.filters = {
		category: req.params.tag
	};
	locals.data = {
		links: [],
		tags: []
	};
	
	// Load all categories
	view.on('init', function(next) {
		
		keystone.list('LinkTag').model.find().sort('name').exec(function(err, results) {
			
			if (err || !results.length) {
				return next(err);
			}
			
			locals.data.tags = results;
			
			// Load the counts for each category
			async.each(locals.data.tags, function(category, next) {
				
				keystone.list('Link').model.count().where('category').in([category.id]).exec(function(err, count) {
					tag.linkCount = count;
					next(err);
				});
				
			}, function(err) {
				next(err);
			});
			
		});
		
	});
	
	// Load the current category filter
	view.on('init', function(next) {
		
		if (req.params.tag) {
			keystone.list('LinkTag').model.findOne({ key: locals.filters.tag }).exec(function(err, result) {
				locals.data.tag = result;
				next(err);
			});
		} else {
			next();
		}
		
	});
	
	// Load the posts
	view.on('init', function(next) {
		
		var q = keystone.list('Link').model.find().where('state', 'published').sort('-publishedDate').populate('author tags');
		
		if (locals.data.category) {
			q.where('tags').in([locals.data.tag]);
		}
		
		q.exec(function(err, results) {
			locals.data.links = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('site/links');
	
}
