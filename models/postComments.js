var keystone = require('keystone'),
	Types = keystone.Field.Types;

var PostComment = new keystone.List('PostComment', {
	nocreate: true
});

PostComment.add({
	post: { type: Types.Relationship, ref: 'Post', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	date: { type: Types.Date, default: Date.now, index: true },
	content: { type: Types.Markdown }
});

PostComment.defaultColumns = 'post, author, date|20%';
PostComment.register();
