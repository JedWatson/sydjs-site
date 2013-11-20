var keystone = require('keystone'),
	Types = keystone.Field.Types;

var LinkComment = new keystone.List('LinkComment', {
	nocreate: true
});

LinkComment.add({
	link: { type: Types.Relationship, ref: 'Link', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	date: { type: Types.Date, default: Date.now, index: true },
	content: { type: Types.Markdown }
});

LinkComment.defaultColumns = 'author, date|20%';
LinkComment.register();
