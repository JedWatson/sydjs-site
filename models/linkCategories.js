var keystone = require('keystone'),
	Types = keystone.Field.Types;

var LinkCategory = new keystone.List('LinkCategory', {
	autokey: { from: 'name', path: 'key', unique: true }
});

LinkCategory.add({
	name: { type: String, required: true }
});

LinkCategory.relationship({ ref: 'Link', refPath: 'categories', path: 'links' });

LinkCategory.addPattern('standard meta');
LinkCategory.register();
