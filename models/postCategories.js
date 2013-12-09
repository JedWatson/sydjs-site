var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Post Categories Model
 * =====================
 */

var PostCategory = new keystone.List('PostCategory', {
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

PostCategory.addPattern('standard meta');
PostCategory.register();
