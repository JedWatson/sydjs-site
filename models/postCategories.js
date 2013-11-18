var keystone = require('keystone'),
	Types = keystone.Field.Types;

var PostCategory = new keystone.List('PostCategory', {
	autokey: { from: 'name', path: 'key', unique: true }
});

PostCategory.add({
	name: { type: String, required: true }
});

PostCategory.relationship({ ref: 'Post', refPath: 'categories', path: 'posts' });

PostCategory.addPattern('standard meta');
PostCategory.register();
