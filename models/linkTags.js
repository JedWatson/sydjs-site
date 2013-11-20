var keystone = require('keystone'),
	Types = keystone.Field.Types;

var LinkTag = new keystone.List('LinkTag', {
	autokey: { from: 'name', path: 'key', unique: true }
});

LinkTag.add({
	name: { type: String, required: true }
});

LinkTag.relationship({ ref: 'Link', refPath: 'tags', path: 'links' });

LinkTag.addPattern('standard meta');
LinkTag.register();
