var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Categories Model
 * =====================
 */

var PostCategory = new keystone.List('PostCategory', {
	track: true,
	autokey: { from: 'name', path: 'key', unique: true }
});

PostCategory.add({
	name: { type: String, required: true }
});


/**
 * Relationships
 * =============
 */

PostCategory.relationship({ ref: 'Post', refPath: 'categories', path: 'posts' });


/**
 * Registration
 * ============
 */

PostCategory.register();
